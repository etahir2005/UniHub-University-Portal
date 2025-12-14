import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';
import { verifyToken, extractToken } from '@/lib/auth';

// GET resources with search and filtering
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        let query: any = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const resources = await Resource.find(query)
            .populate('uploadedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json({ resources });
    } catch (error: any) {
        console.error('Get resources error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST create resource
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const authHeader = req.headers.get('authorization');
        const token = extractToken(authHeader);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, category, type, fileUrl, tags } = body;

        if (!title || !description || !category || !type || !fileUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const resource = await Resource.create({
            title,
            description,
            category,
            type,
            fileUrl,
            uploadedBy: decoded.userId,
            tags: tags || [],
            downloads: 0,
        });

        const populatedResource = await Resource.findById(resource._id)
            .populate('uploadedBy', 'firstName lastName');

        return NextResponse.json(
            { message: 'Resource uploaded successfully', resource: populatedResource },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create resource error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

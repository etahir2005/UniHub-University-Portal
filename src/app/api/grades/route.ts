import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Grade from '@/models/Grade';
import { verifyToken, extractToken } from '@/lib/auth';

// GET grades
export async function GET(req: NextRequest) {
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

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');

        let query: any = {};
        if (decoded.role === 'student') {
            query.studentId = decoded.userId;
        }
        if (courseId) {
            query.courseId = courseId;
        }

        const grades = await Grade.find(query)
            .populate('courseId', 'courseCode courseName')
            .populate('assignmentId', 'title dueDate')
            .populate('studentId', 'firstName lastName studentId')
            .sort({ gradedAt: -1 });

        return NextResponse.json({ grades });
    } catch (error: any) {
        console.error('Get grades error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

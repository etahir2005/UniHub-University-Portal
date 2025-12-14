import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import User from '@/models/User';
import { verifyToken, extractToken } from '@/lib/auth';

// GET all courses (filtered by role)
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

        let courses;
        if (decoded.role === 'teacher') {
            // Teachers see courses they teach
            courses = await Course.find({ instructor: decoded.userId })
                .populate('instructor', 'firstName lastName email')
                .populate('students', 'firstName lastName email studentId');
        } else if (decoded.role === 'student') {
            // Students see enrolled courses
            courses = await Course.find({ students: decoded.userId })
                .populate('instructor', 'firstName lastName email');
        } else {
            // Admin sees all courses
            courses = await Course.find()
                .populate('instructor', 'firstName lastName email')
                .populate('students', 'firstName lastName email studentId');
        }

        return NextResponse.json({ courses });
    } catch (error: any) {
        console.error('Get courses error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST create new course (teacher only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const authHeader = req.headers.get('authorization');
        const token = extractToken(authHeader);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'teacher') {
            return NextResponse.json({ error: 'Only teachers can create courses' }, { status: 403 });
        }

        const body = await req.json();
        const { courseCode, courseName, schedule, description } = body;

        if (!courseCode || !courseName || !schedule) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if course code already exists
        const existing = await Course.findOne({ courseCode: courseCode.toUpperCase() });
        if (existing) {
            return NextResponse.json({ error: 'Course code already exists' }, { status: 409 });
        }

        const course = await Course.create({
            courseCode: courseCode.toUpperCase(),
            courseName,
            instructor: decoded.userId,
            schedule,
            description,
            students: [],
            status: 'active',
        });

        const populatedCourse = await Course.findById(course._id)
            .populate('instructor', 'firstName lastName email');

        return NextResponse.json({ message: 'Course created successfully', course: populatedCourse }, { status: 201 });
    } catch (error: any) {
        console.error('Create course error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

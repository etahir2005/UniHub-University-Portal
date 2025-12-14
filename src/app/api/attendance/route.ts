import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attendance from '@/models/Attendance';
import Course from '@/models/Course';
import { verifyToken, extractToken } from '@/lib/auth';

// GET attendance records
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

        const attendance = await Attendance.find(query)
            .populate('courseId', 'courseCode courseName')
            .populate('studentId', 'firstName lastName studentId')
            .sort({ date: -1 });

        return NextResponse.json({ attendance });
    } catch (error: any) {
        console.error('Get attendance error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST mark attendance (teacher only)
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
            return NextResponse.json({ error: 'Only teachers can mark attendance' }, { status: 403 });
        }

        const body = await req.json();
        const { courseId, studentId, date, status } = body;

        if (!courseId || !studentId || !date || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify course exists and teacher owns it
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only mark attendance for your courses' }, { status: 403 });
        }

        // Create or update attendance
        const attendance = await Attendance.findOneAndUpdate(
            {
                courseId,
                studentId,
                date: new Date(date),
            },
            {
                courseId,
                studentId,
                date: new Date(date),
                status,
                markedBy: decoded.userId,
            },
            { upsert: true, new: true }
        );

        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate('courseId', 'courseCode courseName')
            .populate('studentId', 'firstName lastName studentId');

        return NextResponse.json({
            message: 'Attendance marked successfully',
            attendance: populatedAttendance,
        });
    } catch (error: any) {
        console.error('Mark attendance error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

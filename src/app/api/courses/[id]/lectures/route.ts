import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lecture from '@/models/Lecture';
import Course from '@/models/Course';
import Notification from '@/models/Notification';
import { verifyToken, extractToken } from '@/lib/auth';

// GET lectures for a course
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const authHeader = req.headers.get('authorization');
        const token = extractToken(authHeader);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const lectures = await Lecture.find({ courseId: params.id })
            .populate('uploadedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json({ lectures });
    } catch (error: any) {
        console.error('Get lectures error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST upload lecture (teacher only)
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const authHeader = req.headers.get('authorization');
        const token = extractToken(authHeader);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'teacher') {
            return NextResponse.json({ error: 'Only teachers can upload lectures' }, { status: 403 });
        }

        // Verify course exists and teacher owns it
        const course = await Course.findById(params.id);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only upload lectures for your courses' }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, fileUrl, fileName, fileSize } = body;

        if (!title || !fileUrl || !fileName || !fileSize) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lecture = await Lecture.create({
            courseId: params.id,
            title,
            description,
            fileUrl,
            fileName,
            fileSize,
            uploadedBy: decoded.userId,
        });

        // Create notifications for all enrolled students
        const notifications = course.students.map((studentId) => ({
            userId: studentId,
            type: 'lecture',
            title: 'New Lecture Material',
            message: `New lecture "${title}" uploaded in ${course.courseName}`,
            relatedId: lecture._id,
        }));

        await Notification.insertMany(notifications);

        const populatedLecture = await Lecture.findById(lecture._id)
            .populate('uploadedBy', 'firstName lastName');

        return NextResponse.json(
            { message: 'Lecture uploaded successfully', lecture: populatedLecture },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Upload lecture error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

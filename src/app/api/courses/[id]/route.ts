import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Announcement from '@/models/Announcement';
import Lecture from '@/models/Lecture';
import Assignment from '@/models/Assignment';
import { verifyToken, extractToken } from '@/lib/auth';

// GET single course details
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

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const course = await Course.findById(params.id)
            .populate('instructor', 'firstName lastName email')
            .populate('students', 'firstName lastName email studentId');

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Get related data
        const announcements = await Announcement.find({ courseId: params.id })
            .populate('postedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(5);

        const lectures = await Lecture.find({ courseId: params.id })
            .populate('uploadedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        const assignments = await Assignment.find({ courseId: params.id })
            .sort({ dueDate: 1 });

        return NextResponse.json({
            course,
            announcements,
            lectures,
            assignments,
        });
    } catch (error: any) {
        console.error('Get course error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT update course (teacher only)
export async function PUT(
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
            return NextResponse.json({ error: 'Only teachers can update courses' }, { status: 403 });
        }

        const course = await Course.findById(params.id);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Verify teacher owns this course
        if (course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only update your own courses' }, { status: 403 });
        }

        const body = await req.json();
        const { courseName, schedule, description, status } = body;

        if (courseName) course.courseName = courseName;
        if (schedule) course.schedule = schedule;
        if (description !== undefined) course.description = description;
        if (status) course.status = status;

        await course.save();

        const updatedCourse = await Course.findById(params.id)
            .populate('instructor', 'firstName lastName email')
            .populate('students', 'firstName lastName email studentId');

        return NextResponse.json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error: any) {
        console.error('Update course error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE course (teacher only)
export async function DELETE(
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
            return NextResponse.json({ error: 'Only teachers can delete courses' }, { status: 403 });
        }

        const course = await Course.findById(params.id);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only delete your own courses' }, { status: 403 });
        }

        await Course.findByIdAndDelete(params.id);

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error: any) {
        console.error('Delete course error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

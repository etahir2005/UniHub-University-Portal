import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Announcement from '@/models/Announcement';
import Course from '@/models/Course';
import Notification from '@/models/Notification';
import { verifyToken, extractToken } from '@/lib/auth';

// GET announcements
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
        if (courseId) {
            query.courseId = courseId;
        }

        const announcements = await Announcement.find(query)
            .populate('courseId', 'courseCode courseName')
            .populate('postedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json({ announcements });
    } catch (error: any) {
        console.error('Get announcements error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST create announcement (teacher only)
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
            return NextResponse.json({ error: 'Only teachers can post announcements' }, { status: 403 });
        }

        const body = await req.json();
        const { courseId, title, content, priority } = body;

        if (!courseId || !title || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify course exists and teacher owns it
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only post announcements for your courses' }, { status: 403 });
        }

        const announcement = await Announcement.create({
            courseId,
            title,
            content,
            postedBy: decoded.userId,
            priority: priority || 'normal',
        });

        // Create notifications for all enrolled students
        const notifications = course.students.map((studentId) => ({
            userId: studentId,
            type: 'announcement',
            title: 'New Announcement',
            message: `${title} - ${course.courseName}`,
            relatedId: announcement._id,
        }));

        await Notification.insertMany(notifications);

        const populatedAnnouncement = await Announcement.findById(announcement._id)
            .populate('courseId', 'courseCode courseName')
            .populate('postedBy', 'firstName lastName');

        return NextResponse.json(
            { message: 'Announcement posted successfully', announcement: populatedAnnouncement },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create announcement error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

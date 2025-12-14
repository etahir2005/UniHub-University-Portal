import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import Course from '@/models/Course';
import Notification from '@/models/Notification';
import { verifyToken, extractToken } from '@/lib/auth';

// GET assignments
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

        const assignments = await Assignment.find(query)
            .populate('courseId', 'courseCode courseName')
            .populate('createdBy', 'firstName lastName')
            .sort({ dueDate: 1 });

        // If student, get their submissions
        if (decoded.role === 'student') {
            const assignmentsWithSubmissions = await Promise.all(
                assignments.map(async (assignment) => {
                    const submission = await Submission.findOne({
                        assignmentId: assignment._id,
                        studentId: decoded.userId,
                    });

                    return {
                        ...assignment.toObject(),
                        submission: submission || null,
                    };
                })
            );

            return NextResponse.json({ assignments: assignmentsWithSubmissions });
        }

        return NextResponse.json({ assignments });
    } catch (error: any) {
        console.error('Get assignments error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST create assignment (teacher only)
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
            return NextResponse.json({ error: 'Only teachers can create assignments' }, { status: 403 });
        }

        const body = await req.json();
        const { courseId, title, description, dueDate, totalPoints, attachments } = body;

        if (!courseId || !title || !description || !dueDate || !totalPoints) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify course exists and teacher owns it
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only create assignments for your courses' }, { status: 403 });
        }

        const assignment = await Assignment.create({
            courseId,
            title,
            description,
            dueDate: new Date(dueDate),
            totalPoints,
            attachments: attachments || [],
            createdBy: decoded.userId,
        });

        // Create notifications for all enrolled students
        const notifications = course.students.map((studentId) => ({
            userId: studentId,
            type: 'assignment',
            title: 'New Assignment',
            message: `New assignment "${title}" in ${course.courseName}`,
            relatedId: assignment._id,
        }));

        await Notification.insertMany(notifications);

        const populatedAssignment = await Assignment.findById(assignment._id)
            .populate('courseId', 'courseCode courseName')
            .populate('createdBy', 'firstName lastName');

        return NextResponse.json(
            { message: 'Assignment created successfully', assignment: populatedAssignment },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

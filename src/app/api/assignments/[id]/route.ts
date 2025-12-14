import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import { verifyToken, extractToken } from '@/lib/auth';

// GET assignment details
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

        const assignment = await Assignment.findById(params.id)
            .populate('courseId', 'courseCode courseName')
            .populate('createdBy', 'firstName lastName');

        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        // If student, get their submission
        let submission = null;
        if (decoded.role === 'student') {
            submission = await Submission.findOne({
                assignmentId: params.id,
                studentId: decoded.userId,
            });
        }

        return NextResponse.json({ assignment, submission });
    } catch (error: any) {
        console.error('Get assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT update assignment (teacher only)
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
            return NextResponse.json({ error: 'Only teachers can update assignments' }, { status: 403 });
        }

        const assignment = await Assignment.findById(params.id);
        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        if (assignment.createdBy.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only update your own assignments' }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, dueDate, totalPoints, attachments } = body;

        if (title) assignment.title = title;
        if (description) assignment.description = description;
        if (dueDate) assignment.dueDate = new Date(dueDate);
        if (totalPoints !== undefined) assignment.totalPoints = totalPoints;
        if (attachments) assignment.attachments = attachments;

        await assignment.save();

        const updatedAssignment = await Assignment.findById(params.id)
            .populate('courseId', 'courseCode courseName')
            .populate('createdBy', 'firstName lastName');

        return NextResponse.json({ message: 'Assignment updated successfully', assignment: updatedAssignment });
    } catch (error: any) {
        console.error('Update assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE assignment (teacher only)
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
            return NextResponse.json({ error: 'Only teachers can delete assignments' }, { status: 403 });
        }

        const assignment = await Assignment.findById(params.id);
        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        if (assignment.createdBy.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only delete your own assignments' }, { status: 403 });
        }

        await Assignment.findByIdAndDelete(params.id);
        await Submission.deleteMany({ assignmentId: params.id });

        return NextResponse.json({ message: 'Assignment deleted successfully' });
    } catch (error: any) {
        console.error('Delete assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

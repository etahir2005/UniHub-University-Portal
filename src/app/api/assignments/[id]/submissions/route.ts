import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import Course from '@/models/Course';
import { verifyToken, extractToken } from '@/lib/auth';

// GET all submissions for an assignment (teacher only)
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
        if (!decoded || decoded.role !== 'teacher') {
            return NextResponse.json({ error: 'Only teachers can view submissions' }, { status: 403 });
        }

        const assignment = await Assignment.findById(params.id).populate('courseId');
        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        // Verify teacher owns the course
        const course = await Course.findById(assignment.courseId);
        if (!course || course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only view submissions for your courses' }, { status: 403 });
        }

        const submissions = await Submission.find({ assignmentId: params.id })
            .populate('studentId', 'firstName lastName email studentId')
            .sort({ submittedAt: -1 });

        return NextResponse.json({ submissions, assignment });
    } catch (error: any) {
        console.error('Get submissions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

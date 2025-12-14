import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import Grade from '@/models/Grade';
import Assignment from '@/models/Assignment';
import Course from '@/models/Course';
import Notification from '@/models/Notification';
import { verifyToken, extractToken } from '@/lib/auth';
import { calculatePercentage } from '@/lib/utils';

// POST grade a submission (teacher only)
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
            return NextResponse.json({ error: 'Only teachers can grade submissions' }, { status: 403 });
        }

        const body = await req.json();
        const { submissionId, grade, feedback } = body;

        if (!submissionId || grade === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        const assignment = await Assignment.findById(submission.assignmentId).populate('courseId');
        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        // Verify teacher owns the course
        const course = await Course.findById(assignment.courseId);
        if (!course || course.instructor.toString() !== decoded.userId) {
            return NextResponse.json({ error: 'You can only grade submissions for your courses' }, { status: 403 });
        }

        // Validate grade
        if (grade < 0 || grade > assignment.totalPoints) {
            return NextResponse.json(
                { error: `Grade must be between 0 and ${assignment.totalPoints}` },
                { status: 400 }
            );
        }

        // Update submission
        submission.grade = grade;
        submission.feedback = feedback || '';
        submission.status = 'graded';
        await submission.save();

        // Create or update grade record
        const percentage = calculatePercentage(grade, assignment.totalPoints);
        await Grade.findOneAndUpdate(
            {
                studentId: submission.studentId,
                assignmentId: assignment._id,
            },
            {
                studentId: submission.studentId,
                courseId: assignment.courseId,
                assignmentId: assignment._id,
                grade,
                maxGrade: assignment.totalPoints,
                percentage,
                feedback: feedback || '',
                gradedBy: decoded.userId,
                gradedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        // Create notification for student
        await Notification.create({
            userId: submission.studentId,
            type: 'grade',
            title: 'Assignment Graded',
            message: `Your assignment "${assignment.title}" has been graded: ${grade}/${assignment.totalPoints}`,
            relatedId: assignment._id,
        });

        const updatedSubmission = await Submission.findById(submissionId)
            .populate('studentId', 'firstName lastName email studentId');

        return NextResponse.json({
            message: 'Submission graded successfully',
            submission: updatedSubmission,
        });
    } catch (error: any) {
        console.error('Grade submission error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

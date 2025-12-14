import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import Grade from '@/models/Grade';
import Notification from '@/models/Notification';
import { verifyToken, extractToken } from '@/lib/auth';
import { calculatePercentage } from '@/lib/utils';

// POST submit assignment (student only)
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
        if (!decoded || decoded.role !== 'student') {
            return NextResponse.json({ error: 'Only students can submit assignments' }, { status: 403 });
        }

        const assignment = await Assignment.findById(params.id);
        if (!assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        const body = await req.json();
        const { files } = body;

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({
            assignmentId: params.id,
            studentId: decoded.userId,
        });

        if (existingSubmission) {
            // Update existing submission
            existingSubmission.files = files;
            existingSubmission.submittedAt = new Date();
            existingSubmission.status = 'pending';
            await existingSubmission.save();

            return NextResponse.json({
                message: 'Assignment resubmitted successfully',
                submission: existingSubmission,
            });
        }

        // Create new submission
        const submission = await Submission.create({
            assignmentId: params.id,
            studentId: decoded.userId,
            files,
            submittedAt: new Date(),
            status: 'pending',
        });

        return NextResponse.json(
            { message: 'Assignment submitted successfully', submission },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Submit assignment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
    assignmentId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    files: string[];
    submittedAt: Date;
    grade?: number;
    feedback?: string;
    status: 'pending' | 'graded';
    createdAt: Date;
    updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
    {
        assignmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Assignment',
            required: true,
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        files: [
            {
                type: String,
                required: true,
            },
        ],
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        grade: {
            type: Number,
            min: 0,
        },
        feedback: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'graded'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Ensure one submission per student per assignment
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;

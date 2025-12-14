import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    dueDate: Date;
    totalPoints: number;
    attachments: string[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        totalPoints: {
            type: Number,
            required: true,
            min: 0,
        },
        attachments: [
            {
                type: String,
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export default Assignment;

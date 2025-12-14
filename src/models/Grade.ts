import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGrade extends Document {
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    assignmentId: mongoose.Types.ObjectId;
    grade: number;
    maxGrade: number;
    percentage: number;
    feedback?: string;
    gradedAt: Date;
    gradedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const GradeSchema = new Schema<IGrade>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        assignmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Assignment',
            required: true,
        },
        grade: {
            type: Number,
            required: true,
            min: 0,
        },
        maxGrade: {
            type: Number,
            required: true,
            min: 0,
        },
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        feedback: {
            type: String,
        },
        gradedAt: {
            type: Date,
            default: Date.now,
        },
        gradedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Grade: Model<IGrade> = mongoose.models.Grade || mongoose.model<IGrade>('Grade', GradeSchema);

export default Grade;

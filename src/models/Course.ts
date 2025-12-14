import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
    courseCode: string;
    courseName: string;
    instructor: mongoose.Types.ObjectId;
    students: mongoose.Types.ObjectId[];
    schedule: string;
    status: 'active' | 'archived';
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
    {
        courseCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        schedule: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'archived'],
            default: 'active',
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;

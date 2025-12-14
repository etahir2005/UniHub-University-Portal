import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILecture extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const LectureSchema = new Schema<ILecture>(
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
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Lecture: Model<ILecture> = mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', LectureSchema);

export default Lecture;

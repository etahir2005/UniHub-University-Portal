import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnnouncement extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    postedBy: mongoose.Types.ObjectId;
    priority: 'normal' | 'high';
    createdAt: Date;
    updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
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
        content: {
            type: String,
            required: true,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        priority: {
            type: String,
            enum: ['normal', 'high'],
            default: 'normal',
        },
    },
    {
        timestamps: true,
    }
);

const Announcement: Model<IAnnouncement> = mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

export default Announcement;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResource extends Document {
    title: string;
    description: string;
    category: 'past-papers' | 'notes' | 'tutorials' | 'projects';
    type: string;
    fileUrl: string;
    uploadedBy: mongoose.Types.ObjectId;
    tags: string[];
    downloads: number;
    createdAt: Date;
    updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['past-papers', 'notes', 'tutorials', 'projects'],
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        downloads: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Resource: Model<IResource> = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;

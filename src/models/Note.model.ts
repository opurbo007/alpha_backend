import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  categoryId?: string;
  tags: string[];
  pinned: boolean;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    categoryId: String,
    tags: [String],
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NoteSchema.index({ userId: 1, title: 'text', content: 'text' });

export const Note = mongoose.model<INote>('Note', NoteSchema);
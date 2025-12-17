import { Schema, model, Document, Types } from 'mongoose';

export interface INotification {
  user: Types.ObjectId;
  scheduledAt: Date;
  message: string;
  done: boolean;
  createdAt?: Date;
}

const notificationSchema = new Schema<INotification & Document>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  message: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ user: 1, scheduledAt: 1 }, { unique: false });

export default model<INotification & Document>('Notification', notificationSchema);

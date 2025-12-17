import { Schema, model, Document, Types } from 'mongoose';

export interface IMedication {
  name: string;
  dose?: string | null;
  times: string[]; // ["08:00","20:00"]
  user: Types.ObjectId;
  createdAt?: Date;
}

const medicationSchema = new Schema<IMedication & Document>({
  name: { type: String, required: true },
  dose: { type: String, default: null },
  times: { type: [String], required: true }, // store as array of "HH:MM"
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

medicationSchema.index({ user: 1, name: 1 });

export default model<IMedication & Document>('Medication', medicationSchema);

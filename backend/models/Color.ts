import mongoose, { Schema, Document } from "mongoose";

export interface IColor extends Document {
  name: string;
  hexCode?: string;
  isActive?: boolean;
}

const colorSchema = new Schema<IColor>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hexCode: {
      type: String,
      default: "",
      match: /^#([0-9A-F]{3}){1,2}$/i,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Color ||
  mongoose.model<IColor>("Color", colorSchema);

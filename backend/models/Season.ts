import mongoose, { Schema, Document } from "mongoose";

export interface ISeason extends Document {
  name: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
}

const seasonSchema = new Schema<ISeason>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug from name
seasonSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.models.Season ||
  mongoose.model<ISeason>("Season", seasonSchema);

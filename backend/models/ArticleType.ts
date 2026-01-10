import mongoose, { Schema, Document, Types } from "mongoose";

export interface IArticleType extends Document {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleTypeSchema: Schema<IArticleType> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
ArticleTypeSchema.pre<IArticleType>("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export default mongoose.models.ArticleType ||
  mongoose.model<IArticleType>("ArticleType", ArticleTypeSchema);

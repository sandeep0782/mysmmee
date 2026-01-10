import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive?: boolean;
  parent?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
CategorySchema.pre<ICategory>("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export default mongoose.model<ICategory>("Category", CategorySchema);

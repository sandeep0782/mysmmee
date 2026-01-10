import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  title?: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  position?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true, // Cloudinary / CDN URL
    },
    link: {
      type: String, // redirect URL when banner is clicked
      default: "",
    },
    position: {
      type: Number, // order of banners (1,2,3...)
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    startDate: {
      type: Date, // optional scheduling
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Banner ||
  mongoose.model<IBanner>("Banner", bannerSchema);

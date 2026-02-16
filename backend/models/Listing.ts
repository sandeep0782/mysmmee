import { Schema, model, Document, Types } from "mongoose";

export interface IListing extends Document {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  uploadedBy: Types.ObjectId; // reference to the user
  status:
    | "pending"
    | "processing"
    | "success"
    | "partial"
    | "failed"
    | "skipped"
    | "error"
  errorFilePath?: string;
  skippedFilePath?: string;
  totalRows?: number;
  validCount?: number;
  skippedCount?: number;
  errorCount?: number;
  bullJobId?: string;
  bullJobFailed?: boolean;
  bullJobError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "success",
        "partial",
        "failed",
        "skipped",
        "error",
      ],
      default: "pending",
    },
    errorFilePath: { type: String },
    skippedFilePath: { type: String },
    totalRows: { type: Number },
    validCount: { type: Number },
    skippedCount: { type: Number },
    errorCount: { type: Number },
    bullJobId: { type: String },
    bullJobFailed: { type: Boolean, default: false },
    bullJobError: { type: String },
  },
  { timestamps: true },
);

const Listing = model<IListing>("Listing", listingSchema);
export default Listing;

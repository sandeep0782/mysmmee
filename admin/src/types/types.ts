export interface Listing {
  _id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  uploadedBy: string | { name?: string };
  status:
    | "pending"
    | "processing"
    | "success"
    | "partial"
    | "failed"
    | "skipped";
  totalRows?: number;
  validCount?: number;
  skippedCount?: number;
  errorCount?: number;
  errorFilePath?: string;
  skippedFilePath?: string;
  createdAt: string;
  updatedAt: string;

  // NEW Bull fields
  bullJobId?: string;
  bullJobFailed?: boolean;
  bullJobError?: string;
}

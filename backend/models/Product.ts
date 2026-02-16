import mongoose, { Document, Schema, Types } from "mongoose";

// ------------------- Variant Interface -------------------
export interface IVariant {
  sku: string;
  brandSize?: string; // e.g., "M", "L"
  standardSize?: number;
  isStandardSizeOnLabel?: boolean;
  stock: number;
  price: number;
  finalPrice: number;
  measurements?: {
    bust?: number;
    hip?: number;
    waist?: number;
    outseamLength?: number;
    toFitWaist?: number;
  };
}

// ------------------- Fashion Details -------------------
export interface IFashionDetails {
  fashionType?: string;
  usage?: string;
  occasion?: string;
  year?: number;
  pattern?: string;
  printOrPatternType?: string;
  ornamentation?: string;
  border?: string;
  trends?: boolean;
  mainTrend?: string;
  sustainable?: boolean;
  stitch?: string;
  careInstructions?: string;
  sizeAndFitDescription?: string;
  whereToWear?: string;
  styleTip?: string;
}

// ------------------- Set Details -------------------
export interface ISetDetails {
  setType?: string;
  sareeFabric?: string;
  blouseFabric?: string;
  blouseIncluded?: boolean;
}

// ------------------- Metadata -------------------
export interface IMetadata {
  styleId?: string;
  styleGroupId?: string;
  vendorSkuCode?: string;
  vendorArticleNumber?: string;
}

export interface IPublishStatus {
  status?: number; // e.g., 0 = pending, 1 = approved, 2 = rejected
  reviewedBy?: string; // admin user ID
  reviewedAt?: Date;
}
// ------------------- Main Product Interface -------------------
export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;

  brand: Types.ObjectId;
  articleType: Types.ObjectId;
  category: Types.ObjectId;
  color: Types.ObjectId;
  season: Types.ObjectId;
  gender: "Womens" | "Boys" | "Girls" | "Mens" | "Unisex";
  collectionName: string;

  price?: number;
  finalPrice?: number;
  metadata?: IMetadata;
  fashionDetails?: IFashionDetails;
  setDetails?: ISetDetails;
  colorRemarks?: string;

  variants: IVariant[];

  multipackSet?: boolean;
  tags: string[];
  images: string[];
  videos: string[];

  publish?: IPublishStatus;

  rating: number;
  numReviews: number;
  seller: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ------------------- Variant Schema -------------------
const variantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: true },
    brandSize: String,
    standardSize: Number,
    isStandardSizeOnLabel: Boolean,
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    finalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (this: any, value: number) {
          return value <= this.price;
        },
        message: "Variant finalPrice cannot be greater than price",
      },
    },
    measurements: {
      bust: Number,
      hip: Number,
      waist: Number,
      outseamLength: Number,
      toFitWaist: Number,
    },
  },
  { _id: false },
);

// ------------------- Product Schema -------------------
const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true },

    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    articleType: {
      type: Schema.Types.ObjectId,
      ref: "ArticleType",
      required: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
    season: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    gender: {
      type: String,
      required: true,
      enum: ["Womens", "Boys", "Girls", "Mens", "Unisex"],
    },
    collectionName: { type: String },

    price: { type: Number, min: 0 },
    finalPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (this: any, value: number) {
          return this.price == null || value <= this.price;
        },
        message: "Final price cannot be greater than price",
      },
    },

    metadata: {
      styleId: String,
      styleGroupId: String,
      vendorSkuCode: String,
      vendorArticleNumber: String,
    },

    fashionDetails: {
      fashionType: String,
      usage: String,
      occasion: String,
      year: Number,
      pattern: String,
      printOrPatternType: String,
      ornamentation: String,
      border: String,
      trends: Boolean,
      mainTrend: String,
      sustainable: Boolean,
      stitch: String,
      careInstructions: String,
      sizeAndFitDescription: String,
      whereToWear: String,
      styleTip: String,
    },

    setDetails: {
      setType: String,
      sareeFabric: String,
      blouseFabric: String,
      blouseIncluded: Boolean,
    },

    colorRemarks: String,

    variants: { type: [variantSchema], default: [] },
    multipackSet: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    images: {
      type: [{ type: String, required: true }],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one image is required",
      },
    },
    videos: { type: [String], default: [] },
    seller: { type: String, required: true },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// ------------------- Slug Auto-generation -------------------
productSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// ------------------- Indexes -------------------
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, brand: 1 });

// ------------------- Export Model -------------------
export default mongoose.model<IProduct>("Product", productSchema);

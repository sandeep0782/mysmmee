import mongoose, { Schema } from "mongoose";

const emailCampaignSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    totalUsers: {
      type: Number,
      required: true,
    },

    sentCount: {
      type: Number,
      default: 0,
    },

    sentUserIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true, // 🚀 performance boost
      },
    ],

    status: {
      type: String,
      enum: ["pending", "sending", "completed"],
      default: "pending",
    },

    lastSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

export default mongoose.model("EmailCampaign", emailCampaignSchema);

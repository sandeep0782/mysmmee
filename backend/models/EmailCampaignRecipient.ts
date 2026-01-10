import mongoose, { Schema } from "mongoose";

const emailCampaignRecipientSchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: "EmailCampaign",
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  sent: {
    type: Boolean,
    default: false,
  },

  sentAt: Date,
});

export default mongoose.model(
  "EmailCampaignRecipient",
  emailCampaignRecipientSchema
);

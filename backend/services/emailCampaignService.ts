import EmailCampaign from "../models/EmailCampaign";
import EmailCampaignRecipient from "../models/EmailCampaignRecipient";
import { sendProductAdvertisement } from "../config/emailConfig";
import { IProduct } from "../models/Products";

const BATCH_SIZE = 100; // emails per batch

export const sendCampaignBatch = async (campaignId: string) => {
  const campaign = await EmailCampaign.findById(campaignId).populate("product");
  if (!campaign || !campaign.product)
    throw new Error("Campaign or product not found");

  const product = campaign.product as unknown as IProduct;

  // If first batch, mark as sending
  if (campaign.status === "pending") {
    campaign.status = "sending";
    await campaign.save();
  }

  // Get recipients not sent yet
  const recipients = await EmailCampaignRecipient.find({
    campaign: campaign._id,
    sent: false,
  }).limit(BATCH_SIZE);

  for (const r of recipients) {
    try {
      await sendProductAdvertisement(r.email, product);

      r.sent = true;
      r.sentAt = new Date();
      await r.save();

      // Increment sentCount on campaign
      campaign.sentCount += 1;

      // Optional: store userId for summary
      if (!campaign.sentUserIds.includes(r.user)) {
        campaign.sentUserIds.push(r.user);
      }

      // Save campaign status after each email for live updates
      campaign.status =
        campaign.sentCount >= campaign.totalUsers ? "completed" : "sending";
      campaign.lastSentAt = new Date();
      await campaign.save();
    } catch (err) {
      console.error(`Failed to send email to ${r.email}:`, err);
    }
  }

  // Return updated info
  return {
    campaignId: campaign._id,
    sentCount: campaign.sentCount,
    totalUsers: campaign.totalUsers,
    status: campaign.status,
    remaining: campaign.totalUsers - campaign.sentCount,
  };
};

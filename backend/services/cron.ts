import cron from "node-cron";
import EmailCampaign from "../models/EmailCampaign";
import { sendCampaignBatch } from "../services/emailCampaignService";

cron.schedule("*/1 * * * *", async () => {
  // console.log(
  //   `[${new Date().toISOString()}] Checking for pending/sending campaigns...`
  // );

  try {
    const campaigns = await EmailCampaign.find({
      status: { $in: ["pending", "sending"] },
    });

    // if (!campaigns.length) {
    //   console.log("No campaigns to process.");
    //   return;
    // }

    for (const campaign of campaigns) {
      try {
        const result = await sendCampaignBatch(campaign._id.toString());
        // console.log(
        //   `Campaign ${campaign._id}: Sent ${result.sentCount}/${result.totalUsers} | Remaining: ${result.remaining} | Status: ${result.status}`
        // );
      } catch (err) {
        console.error(`Error sending batch for campaign ${campaign._id}:`, err);
      }
    }
  } catch (err) {
    console.error("Error fetching campaigns:", err);
  }
});

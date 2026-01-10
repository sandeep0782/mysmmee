import { Request, Response } from "express";
import Products from "../models/Products";
import User from "../models/User";
import EmailCampaign from "../models/EmailCampaign";
import EmailCampaignRecipient from "../models/EmailCampaignRecipient";
import { response } from "../utils/responseHandler";
import { sendCampaignBatch } from "../services/emailCampaignService";
import { sendProductAdvertisement } from "../config/emailConfig";

export const advertiseController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return response(res, 400, "Product ID is required");
    }

    const product = await Products.findById(productId);
    if (!product) {
      return response(res, 404, "Product not found");
    }

    // 1️⃣ Get users (later we can filter)
    const users = await User.find({}, "_id email");

    if (!users.length) {
      return response(res, 400, "No users found");
    }

    // 2️⃣ Create Campaign
    const campaign = await EmailCampaign.create({
      product: product._id,
      totalUsers: users.length,
      status: "pending",
    });

    // 3️⃣ Create recipients
    const recipients = users.map((user) => ({
      campaign: campaign._id,
      user: user._id,
      email: user.email,
    }));

    await EmailCampaignRecipient.insertMany(recipients);

    return response(res, 200, "Campaign created successfully", {
      campaignId: campaign._id,
      totalUsers: users.length,
      sentCount: 0,
      status: campaign.status,
      createdAt: campaign.createdAt,
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    return response(res, 500, "Internal server error");
  }
};

export const sendCampaignController = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    if (!campaignId) return response(res, 400, "Campaign ID is required");

    const result = await sendCampaignBatch(campaignId);
    return response(res, 200, "Batch sent successfully", result);
  } catch (error: any) {
    console.error("Send campaign error:", error);
    return response(res, 500, error.message || "Internal server error");
  }
};

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await EmailCampaign.find({})
      .select("product sentCount totalUsers status")
      .lean();

    res.status(200).json({ success: true, data: campaigns });
  } catch (err) {
    console.error("Fetch campaigns error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const TestTemplate = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { email } = req.body;

    // 1️⃣ Validate input
    if (!productId) return response(res, 400, "Product ID is required");
    if (!email) return response(res, 400, "Email is required");

    // 2️⃣ Fetch product
    const product = await Products.findById(productId);
    if (!product) return response(res, 404, "Product not found");

    // 3️⃣ Send preview email
    await sendProductAdvertisement(email, product);

    // 4️⃣ Respond with success
    return response(res, 200, "Preview sent successfully", {
      productId,
      email,
    });
  } catch (err: any) {
    console.error("TestTemplate error:", err);
    return response(res, 500, err.message || "Server error");
  }
};



import express from "express";
import {
  advertiseController,
  getAllCampaigns,
  sendCampaignController,
  TestTemplate,
} from "../controllers/advertiseController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getAllCampaigns);

router.post(
  "/send-advertisement/:productId",
  authenticateUser,
  advertiseController
);

router.post(
  "/send-campaign/:campaignId",
  authenticateUser,
  sendCampaignController
);
router.post("/test-template/:productId", authenticateUser, TestTemplate);

export default router;

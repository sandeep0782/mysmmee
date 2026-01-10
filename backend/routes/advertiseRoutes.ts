import express from "express";
import {
  advertiseController,
  getAllCampaigns,
  sendCampaignController,
  TestTemplate,
} from "../controllers/advertiseController";

const router = express.Router();

router.get("/", getAllCampaigns);

router.post("/send-advertisement/:productId", advertiseController);

router.post("/send-campaign/:campaignId", sendCampaignController);

router.post("/test-template/:productId", TestTemplate);


export default router;

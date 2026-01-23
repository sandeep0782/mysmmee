import express from "express";
import {
  addOrUpdateReview,
  getProductReviews,
  deleteReview,
} from "../controllers/reviewController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:productId", authenticateUser, addOrUpdateReview);
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", authenticateUser, deleteReview);

export default router;

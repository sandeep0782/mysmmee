import { Router } from "express";
import * as bannerController from "../controllers/bannerController";
import { authenticateUser } from "../middleware/authMiddleware";
import { bannerUpload } from "../config/bannerUpload";

const router = Router();

/**
 * Simple wrapper to catch Multer errors
 */
const uploadWithError = (req: any, res: any, next: any) => {
  bannerUpload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

// Create banner
router.post(
  "/",
  authenticateUser,
  uploadWithError,
  bannerController.createBanner
);

// Get all banners (public)
router.get("/", bannerController.getAllBanners);

// Update banner
router.put(
  "/:id",
  authenticateUser,
  uploadWithError,
  bannerController.updateBanner
);

// Delete banner
router.delete("/:id", authenticateUser, bannerController.deleteBanner);

export default router;

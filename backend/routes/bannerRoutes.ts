import { Router } from "express";
import * as bannerController from "../controllers/bannerController";
import { authenticateUser } from "../middleware/authMiddleware";
import { bannerUpload } from "../config/bannerUpload";

const router = Router();

const uploadWithError = (req: any, res: any, next: any) => {
  console.log("[Upload] Starting file upload");

  bannerUpload.single("image")(req, res, (err: any) => {
    if (err) {
      console.error("[Upload] Multer error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    console.log("[Upload] File upload completed:", req.file?.originalname);
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

// Get banners
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

router.patch("/:id/toggle-active", bannerController.toggleBannerActive);

export default router;

import { Router } from "express";
import * as brandController from "../controllers/brandController";
import { authenticateUser } from "../middleware/authMiddleware";
import { singleFileUpload } from "../utils/multerUpload";

const router = Router();

// Public Route
router.get("/", brandController.getAllBrands);

// Private Routes (WITH upload support)
router.post(
  "/",
  authenticateUser,
  singleFileUpload("brands").single("logo"),
  brandController.createBrand
);

router.put(
  "/:id",
  authenticateUser,
  singleFileUpload("brands").single("logo"),
  brandController.updateBrand
);

router.get("/:id", authenticateUser, brandController.getBrandById);
router.delete("/:id", authenticateUser, brandController.deleteBrand);

export default router;

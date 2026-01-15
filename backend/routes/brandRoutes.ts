import { Router } from "express";
import * as brandController from "../controllers/brandController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// Public Route
router.get("/", brandController.getAllBrands);

// Private Routes
router.post("/", authenticateUser, brandController.createBrand);
router.get("/:id", authenticateUser, brandController.getBrandById);
router.put("/:id", authenticateUser, brandController.updateBrand);
router.delete("/:id", authenticateUser, brandController.deleteBrand);

export default router;

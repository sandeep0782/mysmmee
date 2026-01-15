import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as ColorController from "../controllers/ColorController";
const router = express.Router();

// Public Routes
router.get("/", ColorController.getColors);

// Private Routes
router.get("/:id", authenticateUser, ColorController.getColorById);
router.post("/", authenticateUser, ColorController.createColor);
router.put("/:id", authenticateUser, ColorController.updateColor);
router.delete("/:id", authenticateUser, ColorController.deleteColor);

export default router;

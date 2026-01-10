import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as ColorController from "../controllers/ColorController";
const router = express.Router();

// Routes
router.get("/",  ColorController.getColors);
router.get("/:id" , ColorController.getColorById);
router.post("/",  ColorController.createColor);
router.put("/:id",  ColorController.updateColor);
router.delete("/:id", ColorController.deleteColor);

export default router;

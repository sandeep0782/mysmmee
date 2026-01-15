import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as SeasonController from "../controllers/seasonController";

const router = express.Router();

// Public Routes
router.get("/", SeasonController.getAllSeasons);

// Private Routes
router.get("/:id", authenticateUser, SeasonController.getSeasonById);
router.post("/", authenticateUser, SeasonController.createSeason);
router.put("/:id", authenticateUser, SeasonController.updateSeason);
router.delete("/:id", authenticateUser, SeasonController.deleteSeason);

export default router;

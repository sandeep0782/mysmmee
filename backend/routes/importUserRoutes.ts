import express from "express";
import { importUsersFromExcel } from "../controllers/importUsersController";
import { authenticateUser } from "../middleware/authMiddleware";
import { excelUpload } from "../middleware/excelUpload";

const router = express.Router();

// POST /api/users/import
router.post(
  "/users/import",
  authenticateUser,
  excelUpload.single("file"),
  importUsersFromExcel
);

export default router;

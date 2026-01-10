import express from "express";
import { importProductsFromExcel } from "../controllers/importProductsController";
import { authenticateUser } from "../middleware/authMiddleware";
import { excelUpload } from "../middleware/excelUpload";

const router = express.Router();

router.post(
  "/products/import",
  authenticateUser,
  excelUpload.single("file"),
  importProductsFromExcel // ✅ now types correctly as RequestHandler
);

export default router;

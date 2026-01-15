import express from "express";
import { authenticateUser } from '../middleware/authMiddleware';
import * as CategoryController from "../controllers/categoryController";

const router = express.Router();

// Public Routes
router.get("/", CategoryController.getAllCategories);

// Private Routes
router.post("/", authenticateUser, CategoryController.createCategory);
router.get("/:id", authenticateUser, CategoryController.getCategoryById);
router.put("/:id", authenticateUser, CategoryController.updateCategory);
router.delete("/:id", authenticateUser, CategoryController.deleteCategory);

export default router;

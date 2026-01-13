import express from "express";
import { authenticateUser } from '../middleware/authMiddleware';
import * as CategoryController from "../controllers/categoryController";

const router = express.Router();

router.post("/", authenticateUser, CategoryController.createCategory);

router.get("/", CategoryController.getAllCategories);

router.get("/:id", authenticateUser, CategoryController.getCategoryById);

router.put("/:id", authenticateUser, CategoryController.updateCategory);

router.delete("/:id", authenticateUser, CategoryController.deleteCategory);

export default router;

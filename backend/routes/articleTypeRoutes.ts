import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as ArticleTypes from "../controllers/articleTypeController";

const router = express.Router();

router.post("/", authenticateUser, ArticleTypes.createArticleType);

router.get("/", authenticateUser, ArticleTypes.getAllArticleTypes);

router.get("/:id", authenticateUser, ArticleTypes.getArticleTypeById);

router.put("/:id", authenticateUser, ArticleTypes.updateArticleType);

router.delete("/:id", authenticateUser, ArticleTypes.deleteArticleType);

export default router;

import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import * as ArticleTypes from "../controllers/articleTypeController";
import { singleFileUpload } from "../utils/commonSingleUpload";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  authenticateUser,
  singleFileUpload("article-types").single("image"),
  (req, res, next) => {
    // multer stores file here
    next();
  },
  ArticleTypes.createArticleType
);


/* READ */
router.get("/", ArticleTypes.getAllArticleTypes);
router.get("/:id", authenticateUser, ArticleTypes.getArticleTypeById);

/* UPDATE */
router.put(
  "/:id",
  authenticateUser,
  singleFileUpload("article-types").single("image"),
  ArticleTypes.updateArticleType
);
/* DELETE */
router.delete("/:id", authenticateUser, ArticleTypes.deleteArticleType);

export default router;

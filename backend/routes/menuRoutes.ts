// routes/menuRoutes.ts
import { Router } from "express";
import { getProductMenu } from "../controllers/menuController";

const router = Router();

router.get("/product-menu", getProductMenu);

export default router;

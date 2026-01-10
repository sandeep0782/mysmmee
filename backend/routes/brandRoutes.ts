import { Router } from "express";
import * as brandController from "../controllers/brandController";
// import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

router.post("/",brandController.createBrand);

router.get("/", brandController.getAllBrands);

router.get("/:id" , brandController.getBrandById);

router.put("/:id" , brandController.updateBrand);

router.delete("/:id" , brandController.deleteBrand);

export default router;

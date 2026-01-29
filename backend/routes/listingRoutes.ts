import express from "express";
import multer from "multer";
import {
  uploadListing,
  downloadErrorFile,
  getListings,
  deleteListing,
  processListingController,
} from "../controllers/listingController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// ------------------- Multer Setup -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save uploaded Excel here
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.originalname.match(/\.(xlsx|xls|csv)$/)) {
    return cb(new Error("Only Excel files are allowed!"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// ------------------- Routes -------------------

// 1️⃣ Upload Excel (saves Listing as pending)
router.post("/upload", authenticateUser, upload.single("file"), uploadListing);

// 2️⃣ Process Listing (reads Excel, creates Products, uploads images)
router.post("/process/:listingId", authenticateUser, processListingController);

// 3️⃣ Download Error Excel (if validation or image errors)
router.get("/errors/:listingId", authenticateUser, downloadErrorFile);


router.get("/", authenticateUser, getListings);
router.delete("/:id", authenticateUser, deleteListing);

export default router;

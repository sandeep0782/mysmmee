import multer from "multer";
import path from "path";

// Save uploaded files to /uploads temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

export const bannerUpload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, PNG images are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

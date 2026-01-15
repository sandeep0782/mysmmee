import multer from "multer";
import path from "path";
import fs from "fs";

export const singleFileUpload = (folderName: string) => {
  const uploadPath = path.join(__dirname, "..", "uploads", folderName);

  // Ensure folder exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per image
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.test(ext)) cb(null, true);
      else cb(new Error("Only JPG, JPEG, PNG, WEBP images are allowed"));
    },
  });
};

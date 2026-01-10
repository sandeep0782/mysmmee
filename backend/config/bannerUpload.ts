import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { validateBannerImage } from "../utils/bannerValidator";
import { BANNER_RULES } from "./bannerRules";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const bannerUpload = multer({
  storage,
  limits: {
    fileSize: BANNER_RULES.maxFileSizeMB * 1024 * 1024,
  },
  fileFilter: (_, file, cb) => {
    if (!BANNER_RULES.allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, WEBP allowed"));
    }
    cb(null, true);
  },
}).single("image");

export const uploadBannerToCloudinary = async (file: Express.Multer.File) => {
  // 🔒 Validate BEFORE upload
  await validateBannerImage(file.path);

  return cloudinary.uploader.upload(file.path, {
    folder: "banners",
    resource_type: "image",
    transformation: [
      {
        width: 1920,
        height: 1280, // 3:2 enforced
        crop: "fill",
        gravity: "auto", // smart crop
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
};

// import multer from "multer";
// import {
//   v2 as cloudinary,
//   UploadApiOptions,
//   UploadApiResponse,
// } from "cloudinary";
// import fs from "fs";

// // Upload banner image to Cloudinary (banners folder)
// export const uploadBannerToCloudinary = (
//   file: Express.Multer.File
// ): Promise<UploadApiResponse> => {
//   const options: UploadApiOptions = {
//     folder: "banners",
//     resource_type: "image",
//     transformation: [
//       {
//         width: 1920,
//         height: 600,
//         crop: "fill",
//         quality: "auto",
//         fetch_format: "auto",
//       },
//     ],
//   };

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(file.path, options, (error, result) => {
//       if (error) return reject(error);
//       resolve(result as UploadApiResponse);
//     });
//   });
// };

// // Remove local temp file after upload
export const removeLocalFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to remove file:", err);
  });
};

// // ✅ Multer middleware for banner upload
// export const bannerUpload = multer({ dest: "uploads/" }).single("image");

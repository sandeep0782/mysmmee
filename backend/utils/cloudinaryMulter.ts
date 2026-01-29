// utils/cloudinaryMulter.ts
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// ------------------- Cloudinary Configuration -------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// ------------------- Upload a Buffer to Cloudinary -------------------
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  vendorSku: string,
  folder: string = "products",
): Promise<UploadApiResponse> => {
  // Temporary file path (required because Cloudinary Node SDK doesn't accept raw Buffer directly for upload)
  const tempFilePath = path.join("uploads", `${vendorSku}-${Date.now()}.jpg`);
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const options: UploadApiOptions = {
      folder,
      public_id: vendorSku, // use SKU as the image name
      overwrite: true,
      resource_type: "image",
    };

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(tempFilePath, options, (err, result) => {
        if (err) return reject(err);
        resolve(result as UploadApiResponse);
      });
    });

    return uploaded;
  } finally {
    // Clean up temp file
    fs.unlinkSync(tempFilePath);
  }
};

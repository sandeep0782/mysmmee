import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBannerToCloudinary = async (filePath: string) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "banners",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: "image",
  });
};

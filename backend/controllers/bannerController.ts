import { Request, Response } from "express";
import Banner from "../models/Banner";
import { response } from "../utils/responseHandler";
import {
  uploadBannerToCloudinary,
  removeLocalFile,
} from "../config/bannerUpload";

// export const createBanner = async (req: Request, res: Response) => {
//   let filePath: string | undefined;

//   try {
//     if (!req.file) {
//       return response(res, 400, "Banner image is required");
//     }

//     filePath = req.file.path;

//     const { title, subtitle, link, position, isActive, startDate, endDate } =
//       req.body;

//     const uploadResult = await uploadBannerToCloudinary(req.file);

//     const banner = await Banner.create({
//       title: title?.trim() || "",
//       subtitle: subtitle?.trim() || "",
//       imageUrl: uploadResult.secure_url,
//       link: link || "",
//       position: Number(position) || 0,
//       isActive: isActive === "true" ? true : false,
//       startDate,
//       endDate,
//     });

//     return response(res, 201, "Banner created successfully", banner);
//   } catch (error) {
//     console.error("Create Banner Error:", error);
//     return response(res, 500, "Internal Server Error");
//   } finally {
//     if (filePath) {
//       removeLocalFile(filePath);
//     }
//   }
// };

export const createBanner = async (req: Request, res: Response) => {
  let filePath: string | undefined;

  try {
    if (!req.file) {
      return response(res, 400, "Banner image is required");
    }

    filePath = req.file.path;

    const uploadResult = await uploadBannerToCloudinary(req.file);

    const banner = await Banner.create({
      title: req.body.title?.trim() || "",
      subtitle: req.body.subtitle?.trim() || "",
      imageUrl: uploadResult.secure_url,
      link: req.body.link || "",
      position: Number(req.body.position) || 0,
      isActive: req.body.isActive === "true",
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    return response(res, 201, "Banner created successfully", banner);
  } catch (error: any) {
    console.error("Create Banner Error:", error.message);
    return response(res, 400, error.message || "Invalid banner image");
  } finally {
    if (filePath) removeLocalFile(filePath);
  }
};

export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ position: 1 }); // optional: sort by position
    return response(res, 200, "Banners fetched successfully", banners);
  } catch (error) {
    console.error("Get Banners Error:", error);
    return response(res, 500, "Failed to fetch banners");
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  let filePath: string | undefined;

  try {
    const { id } = req.params;
    const { title, subtitle, link, position, isActive, startDate, endDate } =
      req.body;

    const updateData: any = {
      title: title?.trim() || "",
      subtitle: subtitle?.trim() || "",
      link: link || "",
      position: Number(position) || 0,
      isActive: isActive === "true",
      startDate,
      endDate,
    };

    if (req.file) {
      filePath = req.file.path;
      const uploadResult = await uploadBannerToCloudinary(req.file);
      updateData.imageUrl = uploadResult.secure_url;
    }

    const banner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!banner) return response(res, 404, "Banner not found");

    return response(res, 200, "Banner updated successfully", banner);
  } catch (error: any) {
    console.error("Update Banner Error:", error.message);
    return response(res, 500, "Failed to update banner");
  } finally {
    if (filePath) removeLocalFile(filePath);
  }
};
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return response(res, 404, "Banner not found");
    return response(res, 200, "Banner deleted successfully");
  } catch (error) {
    console.error("Delete Banner Error:", error);
    return response(res, 500, "Failed to delete banner");
  }
};

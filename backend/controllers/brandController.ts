import { Request, Response } from "express";
import Brand from "../models/Brands";
import { response } from "../utils/responseHandler";
import sharp from "sharp";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { removeLocalFile } from "../utils/removeFile";

export const createBrand = async (req: Request, res: Response) => {
  let filePath: string | undefined;

  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return response(res, 400, "Brand name is required");
    }

    const existing = await Brand.findOne({ name: name.trim() });
    if (existing) {
      return response(res, 409, "Brand with this name already exists");
    }

    if (!req.file) {
      return response(res, 400, "Brand logo is required");
    }

    console.log("req.file:", req.file);

    filePath = req.file.path;

    // Compress
    const compressedPath = `${filePath}-compressed.webp`;
    await sharp(filePath).webp({ quality: 60 }).toFile(compressedPath);

    const upload = await uploadImageToCloudinary(compressedPath, "brands");

    removeLocalFile(filePath);
    removeLocalFile(compressedPath);

    const brand = await Brand.create({
      name: name.trim(),
      description,
      logo: upload.secure_url,
      isActive: true,
    });

    return response(res, 201, "Brand created successfully", brand);
  } catch (error) {
    console.error(error);
    if (filePath) removeLocalFile(filePath);
    return response(res, 500, "Internal Server Error");
  }
};

// Create a new brand
// export const createBrand = async (req: Request, res: Response) => {
//   try {
//     const { name, description, logo } = req.body;

//     if (!name) {
//       return response(res, 400, "Brand name is required");
//     }

//     const existingBrand = await Brand.findOne({ name });
//     if (existingBrand) {
//       return response(res, 409, "Brand with this name already exists");
//     }

//     const newBrand = await Brand.create({ name, description, logo });

//     return response(res, 201, "Brand created successfully", newBrand);
//   } catch (error) {
//     console.error(error);
//     return response(res, 500, "Internal Server Error");
//   }
// };

// Get all brands
// export const getAllBrands = async (req: Request, res: Response) => {
//   try {
//     const brands = await Brand.find().sort({ createdAt: -1 });
//     return response(res, 200, "Brands fetched successfully", brands);
//   } catch (error) {
//     console.error(error);
//     return response(res, 500, "Internal Server Error");
//   }
// };

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30"); // cache for 60s
    const brands = await Brand.find().sort({ createdAt: -1 });
    return response(res, 200, "Brands fetched successfully", brands);
  } catch (err) {
    console.error(err);
    return response(res, 500, "Internal Server Error");
  }
};

// Get brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return response(res, 404, "Brand not found");
    }

    return response(res, 200, "Brand fetched successfully", brand);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Update brand


export const updateBrand = async (req: Request, res: Response) => {
  let filePath: string | undefined;

  try {
    const { name, description } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return response(res, 404, "Brand not found");
    }

    // Update name & description if provided
    if (name) brand.name = name;
    if (description) brand.description = description;

    // Handle logo upload
    if (req.file) {
      console.log("req.file:", req.file);
      filePath = req.file.path;

      // Compress
      const compressedPath = `${filePath}-compressed.webp`;
      await sharp(filePath).webp({ quality: 60 }).toFile(compressedPath);

      // Upload to Cloudinary
      const upload = await uploadImageToCloudinary(compressedPath, "brands");

      // Remove local files
      removeLocalFile(filePath);
      removeLocalFile(compressedPath);

      // Save the new logo URL
      brand.logo = upload.secure_url;
    }

    const updatedBrand = await brand.save();

    return response(res, 200, "Brand updated successfully", updatedBrand);
  } catch (error) {
    console.error(error);
    if (filePath) removeLocalFile(filePath);
    return response(res, 500, "Internal Server Error");
  }
};

// export const updateBrand = async (req: Request, res: Response) => {
//   try {
//     const { name, description, logo } = req.body;

//     const brand = await Brand.findById(req.params.id);
//     if (!brand) {
//       return response(res, 404, "Brand not found");
//     }

//     if (name) brand.name = name;
//     if (description) brand.description = description;
//     if (logo) brand.logo = logo;

//     const updatedBrand = await brand.save();

//     return response(res, 200, "Brand updated successfully", updatedBrand);
//   } catch (error) {
//     console.error(error);
//     return response(res, 500, "Internal Server Error");
//   }
// };

// Delete brand
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return response(res, 404, "Brand not found");
    }

    return response(res, 200, "Brand deleted successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

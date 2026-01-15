import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import ArticleType from "../models/ArticleType";
import { removeLocalFile } from "../utils/removeFile";
import { uploadImageToCloudinary } from "../utils/cloudinary";

import sharp from "sharp";
import fs from "fs";



export const createArticleType = async (req: Request, res: Response) => {
  let filePath: string | undefined;

  try {
    const { name, description, slug } = req.body; // removed isActive

    // 1️⃣ Validate name
    if (!name?.trim()) {
      return response(res, 400, "Article Type name is required");
    }

    // 2️⃣ Check if name already exists
    const existing = await ArticleType.findOne({ name: name.trim() });
    if (existing) {
      return response(res, 409, "Article Type with this name already exists");
    }

    // 3️⃣ Check if image is provided
    if (!req.file) {
      return response(res, 400, "Image is required for Article Type");
    }

    const data: any = {
      name: name.trim(),
      description: description || "",
      isActive: true, // set active by default
    };

    if (slug) data.slug = slug;

    /* ===== IMAGE SIZE VALIDATION + COMPRESSION ===== */
    filePath = req.file.path;

    // 4️⃣ Check original file size
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    const maxSizeMB = 20;

    if (fileSizeInMB > maxSizeMB) {
      removeLocalFile(filePath);
      return response(
        res,
        400,
        `Image too large. Maximum allowed size is ${maxSizeMB} MB.`
      );
    }

    // 5️⃣ Compress image without resizing (keep dimensions)
    const compressedPath = `${filePath}-compressed.webp`;
    await sharp(filePath)
      .webp({ quality: 60 }) // reduce file size
      .toFile(compressedPath);

    const compressedStats = fs.statSync(compressedPath);
    console.log(
      `Original: ${fileSizeInMB.toFixed(2)} MB, Compressed: ${(
        compressedStats.size /
        (1024 * 1024)
      ).toFixed(2)} MB`
    );

    // 6️⃣ Upload compressed image to Cloudinary
    const upload = await uploadImageToCloudinary(
      compressedPath,
      "article-types"
    );
    data.image = upload.secure_url;

    // 7️⃣ Remove temporary files
    removeLocalFile(filePath);
    removeLocalFile(compressedPath);

    // 8️⃣ Create article type in DB
    const articleType = await ArticleType.create(data);

    return response(res, 201, "Article Type created successfully", articleType);
  } catch (error) {
    console.error("Create ArticleType Error:", error);
    if (filePath) removeLocalFile(filePath);
    return response(res, 500, "Internal Server Error");
  }
};

// export const createArticleType = async (req: Request, res: Response) => {
//   let filePath: string | undefined;

//   try {
//     const { name, description, slug, isActive } = req.body;

//     if (!name?.trim()) {
//       return response(res, 400, "Article Type name is required");
//     }

//     const existing = await ArticleType.findOne({ name: name.trim() });
//     if (existing) {
//       return response(res, 409, "Article Type with this name already exists");
//     }

//     const data: any = {
//       name: name.trim(),
//       description: description || "",
//       isActive: isActive !== "false",
//     };

//     if (slug) data.slug = slug; // schema auto-generates if missing

//     /* ===== IMAGE UPLOAD ===== */
//     if (req.file) {
//       filePath = req.file.path;

//       const upload = await uploadImageToCloudinary(filePath, "article-types");

//       data.image = upload.secure_url;
//     }

//     const articleType = await ArticleType.create(data);

//     return response(res, 201, "Article Type created successfully", articleType);
//   } catch (error) {
//     console.error("Create ArticleType Error:", error);
//     return response(res, 500, "Internal Server Error");
//   } finally {
//     if (filePath) removeLocalFile(filePath);
//   }
// };

// Get all Article Type
export const getAllArticleTypes = async (req: Request, res: Response) => {
  try {
    const articletypes = await ArticleType.find().sort({ name: 1 });
    return response(
      res,
      200,
      "Article Type fetched successfully",
      articletypes
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Get Article Type by ID
export const getArticleTypeById = async (req: Request, res: Response) => {
  try {
    const articletype = await ArticleType.findById(req.params.id);

    if (!articletype) {
      return response(res, 404, "Article Type not found");
    }

    return response(res, 200, "Article Type fetched successfully", articletype);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const updateArticleType = async (req: Request, res: Response) => {
  let filePath: string | undefined;

  try {
    const { name, description, slug, isActive } = req.body;

    const articleType = await ArticleType.findById(req.params.id);
    if (!articleType) {
      return response(res, 404, "Article Type not found");
    }

    if (name) articleType.name = name.trim();
    if (description !== undefined) articleType.description = description;
    if (slug) articleType.slug = slug;
    if (isActive !== undefined) articleType.isActive = isActive === "true";

    /* ===== IMAGE UPDATE ===== */
    if (req.file) {
      filePath = req.file.path;

      const upload = await uploadImageToCloudinary(filePath, "article-types");

      articleType.image = upload.secure_url;
    }

    const updated = await articleType.save();

    return response(res, 200, "Article Type updated successfully", updated);
  } catch (error: any) {
    console.error("Update ArticleType Error:", error);
    return response(res, 500, "Internal Server Error");
  } finally {
    if (filePath) removeLocalFile(filePath);
  }
};

// Update Article Type
// export const updateArticleType = async (req: Request, res: Response) => {
//   try {
//     const { name, description, slug, image } = req.body;

//     const articletype = await ArticleType.findById(req.params.id);
//     if (!articletype) {
//       return response(res, 404, "Article Type not found");
//     }

//     if (name) articletype.name = name;
//     if (description) articletype.description = description;
//     if (slug) articletype.slug = slug;
//     if (image) articletype.image = image;

//     const updatedArticleType = await articletype.save();

//     return response(
//       res,
//       200,
//       "Article Type updated successfully",
//       updatedArticleType
//     );
//   } catch (error) {
//     console.error(error);
//     return response(res, 500, "Internal Server Error");
//   }
// };

// Delete category
export const deleteArticleType = async (req: Request, res: Response) => {
  try {
    const articleType = await ArticleType.findByIdAndDelete(req.params.id);

    if (!articleType) {
      return response(res, 404, "Article Type not found");
    }

    return response(res, 200, "Article Type deleted successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

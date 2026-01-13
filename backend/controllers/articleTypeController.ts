import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import ArticleType from "../models/ArticleType";

// Create a new category
export const createArticleType = async (req: Request, res: Response) => {
  try {
    const { name, description, slug, image } = req.body;

    if (!name) {
      return response(res, 400, "Article Type name is required");
    }

    // Check if category already exists
    const existingArticleType = await ArticleType.findOne({ name });
    if (existingArticleType) {
      return response(res, 409, "Article Type with this name already exists");
    }

    // Optional: auto-generate slug if not provided
    const articleTypeSlug = slug
      ? slug
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

    const newarticleType = await ArticleType.create({
      name,
      description,
      slug: articleTypeSlug,
      image,
    });

    return response(
      res,
      201,
      "Article TYpe created successfully",
      newarticleType
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

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

// Update Article Type
export const updateArticleType = async (req: Request, res: Response) => {
  try {
    const { name, description, slug, image } = req.body;

    const articletype = await ArticleType.findById(req.params.id);
    if (!articletype) {
      return response(res, 404, "Article Type not found");
    }

    if (name) articletype.name = name;
    if (description) articletype.description = description;
    if (slug) articletype.slug = slug;
    if (image) articletype.image = image;

    const updatedArticleType = await articletype.save();

    return response(
      res,
      200,
      "Article Type updated successfully",
      updatedArticleType
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

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

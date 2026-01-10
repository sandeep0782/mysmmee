import { Request, Response } from "express";
import Category from "../models/Category";
import { response } from "../utils/responseHandler";

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, slug, image } = req.body;

    if (!name) {
      return response(res, 400, "Category name is required");
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return response(res, 409, "Category with this name already exists");
    }

    // Optional: auto-generate slug if not provided
    const categorySlug = slug
      ? slug
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

    const newCategory = await Category.create({
      name,
      description,
      slug: categorySlug,
      image,
    });

    return response(res, 201, "Category created successfully", newCategory);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return response(res, 200, "Categories fetched successfully", categories);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return response(res, 404, "Category not found");
    }

    return response(res, 200, "Category fetched successfully", category);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, slug, image } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return response(res, 404, "Category not found");
    }

    if (name) category.name = name;
    if (description) category.description = description;
    if (slug) category.slug = slug;
    if (image) category.image = image;

    const updatedCategory = await category.save();

    return response(res, 200, "Category updated successfully", updatedCategory);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return response(res, 404, "Category not found");
    }

    return response(res, 200, "Category deleted successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

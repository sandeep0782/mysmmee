import { Request, Response } from "express";
import Color from "../models/Color";
import { response } from "../utils/responseHandler";

// Get all colors
export const getColors = async (_req: Request, res: Response) => {
  try {
    const colors = await Color.find({ isActive: true }).sort({ name: 1 });
    return response(res, 200, "Colors fetched successfully", colors);
  } catch (error) {
    return response(res, 500, "Failed to fetch colors");
  }
};

// Get color by ID
export const getColorById = async (req: Request, res: Response) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return response(res, 404, "Color not found");
    }
    return response(res, 200, "Color fetched successfully", color);
  } catch (error) {
    return response(res, 500, "Failed to fetch color");
  }
};

// Create color
export const createColor = async (req: Request, res: Response) => {
  try {
    const { name, hexCode } = req.body;

    const exists = await Color.findOne({ name });
    if (exists) {
      return response(res, 400, "Color already exists");
    }

    const color = await Color.create({ name, hexCode });
    return response(res, 201, "Color created successfully", color);
  } catch (error) {
    return response(res, 500, "Failed to create color");
  }
};

// Update color
export const updateColor = async (req: Request, res: Response) => {
  try {
    const { name, hexCode, isActive } = req.body;

    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { name, hexCode, isActive },
      { new: true }
    );

    if (!color) {
      return response(res, 404, "Color not found");
    }

    return response(res, 200, "Color updated successfully", color);
  } catch (error) {
    return response(res, 500, "Failed to update color");
  }
};

// Delete color
export const deleteColor = async (req: Request, res: Response) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) {
      return response(res, 404, "Color not found");
    }
    return response(res, 200, "Color deleted successfully");
  } catch (error) {
    return response(res, 500, "Failed to delete color");
  }
};

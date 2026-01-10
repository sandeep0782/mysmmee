import { Request, Response } from "express";
import Season from "../models/Season";
import { response } from "../utils/responseHandler";

// Create a new season
export const createSeason = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return response(res, 400, "Season name is required");
    }

    const existingSeason = await Season.findOne({ name });
    if (existingSeason) {
      return response(res, 409, "Season with this name already exists");
    }

    const newSeason = await Season.create({ name, description });

    return response(res, 201, "Season created successfully", newSeason);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Get all seasons
export const getAllSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await Season.find().sort({ createdAt: -1 });
    return response(res, 200, "Seasons fetched successfully", seasons);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Get season by ID
export const getSeasonById = async (req: Request, res: Response) => {
  try {
    const season = await Season.findById(req.params.id);

    if (!season) {
      return response(res, 404, "Season not found");
    }

    return response(res, 200, "Season fetched successfully", season);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Update season
export const updateSeason = async (req: Request, res: Response) => {
  try {
    const { name, description, icon } = req.body;

    const season = await Season.findById(req.params.id);
    if (!season) {
      return response(res, 404, "Season not found");
    }

    if (name) season.name = name;
    if (description) season.description = description;
    if (icon) season.icon = icon;

    const updatedSeason = await season.save();

    return response(res, 200, "Season updated successfully", updatedSeason);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// Delete season
export const deleteSeason = async (req: Request, res: Response) => {
  try {
    const season = await Season.findByIdAndDelete(req.params.id);

    if (!season) {
      return response(res, 404, "Season not found");
    }

    return response(res, 200, "Season deleted successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

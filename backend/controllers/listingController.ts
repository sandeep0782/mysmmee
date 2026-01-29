import fs from "fs";
import path from "path";
import { processListing } from "../services/listingService";

import { Request, Response, NextFunction } from "express";
import Listing, { IListing } from "../models/Listing";
import { listingQueue } from "../queue/listing.queue";

export const uploadListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const userId = req.id;
    // ✅ Let TS infer type from Listing model
    const listing = await Listing.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadedBy: userId,
      status: "pending",
    });

    // ✅ Safely convert _id to string
    const listingId = listing._id?.toString();

    if (!listingId) {
      throw new Error("Listing _id is missing");
    }

    // ✅ Add job to queue
    await listingQueue.add("process-listing", { listingId, userId });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      listing,
    });
  } catch (err) {
    next(err);
  }
};

export const processListingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { listingId } = req.params;
    const userId = req.id;

    await processListing(listingId, userId);
    res.status(200).json({ success: true, message: "Listing processed" });
  } catch (err) {
    next(err);
  }
};

export const downloadErrorFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);

    if (!listing || !listing.errorFilePath) {
      res.status(404).json({ message: "Error file not found" });
      return;
    }

    const filePath = path.join(process.cwd(), listing.errorFilePath);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "File does not exist on server" });
      return;
    }

    // download file
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        next(err); // propagate download error
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email");

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
    });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete listing",
    });
  }
};

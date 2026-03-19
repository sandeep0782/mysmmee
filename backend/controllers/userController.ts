import { Request, Response, Router } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";

const router = Router();

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    if (!userId) {
      return response(res, 400, "User ID is required.");
    }
    const { name, email, phoneNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber },
      { new: true, runValidators: true },
    ).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires",
    );
    if (!updatedUser) {
      return response(res, 404, "User not found.");
    }

    return response(
      res,
      200,
      "User profile updated successfully.",
      updatedUser,
    );
  } catch (error) {
    return response(res, 500, "Internal server error.", error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return response(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export default router;

import { Request, Response } from "express";
import Review from "../models/Review";
import Product from "../models/Products";
import { response } from "../utils/responseHandler";

/**
 * CREATE OR UPDATE REVIEW
 */
export const addOrUpdateReview = async (req: Request, res: Response) => {
  try {
    const userId = req.id; // from auth middleware
    const { productId } = req.params; // <- get from URL
    const { rating, comment } = req.body; // rating & comment stay in body

    if (!rating || rating < 1 || rating > 5) {
      return response(res, 400, "Rating must be between 1 and 5");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return response(res, 404, "Product not found");
    }

    // Check if review exists
    let review = await Review.findOne({ user: userId, product: productId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment,
      });
    }

    await updateProductRating(productId);

    return response(res, 200, "Review submitted successfully", review);
  } catch (error: any) {
    if (error.code === 11000) {
      return response(res, 400, "You already reviewed this product");
    }
    return response(res, 500, "Failed to submit review");
  }
};

/**
 * GET REVIEWS BY PRODUCT
 */
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return response(res, 200, "Reviews fetched successfully", reviews);
  } catch (error) {
    return response(res, 500, "Failed to fetch reviews");
  }
};

/**
 * DELETE REVIEW
 */
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return response(res, 404, "Review not found");
    }

    await updateProductRating(review.product);

    return response(res, 200, "Review deleted successfully");
  } catch (error) {
    return response(res, 500, "Failed to delete review");
  }
};

/**
 * HELPER: UPDATE PRODUCT RATING
 */
const updateProductRating = async (productId: any) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;
  const avgRating =
    numReviews === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(avgRating.toFixed(1)),
    numReviews,
  });
};

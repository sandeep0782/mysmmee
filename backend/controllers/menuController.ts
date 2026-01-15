import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Products";
import Category from "../models/Category";
import ArticleType from "../models/ArticleType";
import { response } from "../utils/responseHandler";

/**
 * Aggregation result type
 */
type CategoryAggregation = {
  _id: mongoose.Types.ObjectId;
  articleTypes: mongoose.Types.ObjectId[];
};

export const getProductMenu = async (req: Request, res: Response) => {
  try {
    /**
     * STEP 1: Aggregate unique articleTypes per category from products
     */
    const aggregation = (await Product.aggregate([
      {
        $match: {
          category: { $ne: null },
          articleType: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            articleType: "$articleType",
          },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          articleTypes: { $addToSet: "$_id.articleType" },
        },
      },
    ])) as CategoryAggregation[];

    if (!aggregation.length) {
      return response(res, 200, "Menu fetched successfully", []);
    }

    /**
     * STEP 2: Fetch category details
     */
    const categoryIds = aggregation.map((item) => item._id);

    const categories = await Category.find({
      _id: { $in: categoryIds },
      isActive: true,
    })
      .select("name slug")
      .lean();

    /**
     * STEP 3: Fetch articleType details
     */
    const articleTypeIds = aggregation.flatMap((item) => item.articleTypes);

    const articleTypes = await ArticleType.find({
      _id: { $in: articleTypeIds },
    })
      .select("name slug")
      .lean();

    /**
     * STEP 4: Build menu response
     */
    const menu = categories.map((category) => {
      const categoryAggregation = aggregation.find(
        (agg) => String(agg._id) === String(category._id)
      );

      const mappedArticleTypes =
        categoryAggregation?.articleTypes?.map((articleId) =>
          articleTypes.find((a) => String(a._id) === String(articleId))
        ) ?? [];

      return {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        articleTypes: mappedArticleTypes.filter(Boolean),
      };
    });

    return response(res, 200, "Menu fetched successfully", menu);
  } catch (error) {
    console.error("Menu fetch error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

import { Request, Response } from "express";
import XLSX from "xlsx";
import slugify from "slugify";
import Product from "../models/Products";
import Brand from "../models/Brands";
import Season from "../models/Season";
import Color from "../models/Color";
import Category from "../models/Category";
import { response } from "../utils/responseHandler";

export const importProductsFromExcel = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return response(res, 400, "Excel file is required");
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const errors: any[] = [];
    const productsToInsert: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row: any = rows[i];
      try {
        const brand = await Brand.findOne({ name: row.Brand });
        const season = await Season.findOne({ name: row.Season });
        const color = await Color.findOne({ name: row.Color });
        const category = await Category.findOne({ name: row.Category });

        if (!brand) throw "Invalid Brand";
        if (!season) throw "Invalid Season";
        if (!color) throw "Invalid Color";
        if (!category) throw "Invalid Category";

        let paymentDetails: any = {};
        if (row["Payment Mode"] === "UPI") {
          if (!row["UPI ID"]) throw "UPI ID required";
          paymentDetails = { upiId: row["UPI ID"] };
        }

        const product = {
          title: row.Title,
          slug: slugify(row.Title, { lower: true }),
          description: row.Description,
          subject: row.Subject,
          author: row.Author,
          edition: row.Edition,
          price: Number(row.Price),
          finalPrice: Number(row["Final Price"]),
          shippingCharge: Number(row["Shipping Charge"]),
          classType: row["Class Type"],
          paymentMode: row["Payment Mode"],
          paymentDetails,
          brand: brand._id,
          season: season._id,
          color: color._id,
          category: category._id,
          gender: row.Gender,
          condition: row.Condition,
          images: row.Images?.split(",") || [],
          seller: req.id,
        };

        if (product.finalPrice > product.price) {
          throw "Final price cannot exceed price";
        }

        productsToInsert.push(product);
      } catch (err: any) {
        errors.push({
          row: i + 2, // Excel row number
          message: err.toString(),
        });
      }
    }

    if (errors.length > 0) {
      return response(res, 400, "Validation failed", { errors });
    }

    await Product.insertMany(productsToInsert);

    return response(res, 201, "Products imported successfully", {
      count: productsToInsert.length,
    });
  } catch (error: any) {
    console.error("Full import error:", error); // 🔹 log full error
    return response(res, 500, "Error importing products", {
      error: error.message || error.toString(), // 🔹 return the actual error
    });
  }
};

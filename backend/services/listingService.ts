import XLSX from "xlsx";
import path from "path";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import { Types } from "mongoose";

import Listing from "../models/Listing";
import Product, { IProduct } from "../models/Product";
import { uploadBufferToCloudinary } from "../utils/cloudinaryMulter";
import Brands from "../models/Brands";
import ArticleType from "../models/ArticleType";
import Category from "../models/Category";
import Color from "../models/Color";
import Season from "../models/Season";

interface ErrorRow {
  rowNumber: number;
  reason: string;
  data: any;
}

export const processListing = async (listingId: string, userId: string) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new Error("Listing not found");
    console.error("❌ Listing not found for ID:", listingId);
  }

  listing.status = "processing";
  await listing.save();

  const workbook = XLSX.readFile(listing.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  let totalRows = rows.length;
  let validCount = 0;
  let skippedCount = 0;

  const errorRows: ErrorRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // Excel row number (header = 1)

    try {
      // ----------------- Validate required fields with details -----------------
      const missingFields = [];
      if (!row.Title) missingFields.push("Title");
      if (!row["Vendor SKU Code"]) missingFields.push("Vendor SKU Code");
      if (!row.Price) missingFields.push("Price");

      if (missingFields.length > 0) {
        errorRows.push({
          rowNumber,
          reason: `Missing required fields: ${missingFields.join(", ")}`,
          data: row,
        });
        skippedCount++;
        continue;
      }

      // ----------------- Check duplicate SKU -----------------
      const exists = await Product.findOne({ "variants.sku": row.Title });
      if (exists) {
        errorRows.push({ rowNumber, reason: "Duplicate SKU", data: row });
        skippedCount++;
        continue;
      }

      // ----------------- Process Images -----------------
      const imageUrls: string[] = [];
      if (row.Images) {
        const images = row.Images.split(",").map((i: string) => i.trim());
        for (const url of images) {
          try {
            const response = await axios.get(url, {
              responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "binary");

            const metadata = await sharp(buffer).metadata();

            // if (metadata.width !== 1440 || metadata.height !== 1080) {
            //   throw new Error("Image must be 1440x1080");
            // }

            // Upload to Cloudinary using SKU as filename
            const uploaded = await uploadBufferToCloudinary(buffer, row.sku);

            imageUrls.push(uploaded.secure_url);
          } catch (err: any) {
            throw new Error(`Image error for ${url}: ${err.message}`);
          }
        }
      }

      // ----------------- Fetch and validate related documents -----------------
      const brandDoc = await Brands.findOne({ name: row.Brand });
      if (!brandDoc) throw new Error(`Brand not found: ${row.Brand}`);
      const brandId: Types.ObjectId = brandDoc._id as Types.ObjectId;

      const articleTypeDoc = await ArticleType.findOne({
        name: row["Article Type"],
      });
      if (!articleTypeDoc)
        throw new Error(`Article Type not found: ${row["Article Type"]}`);
      const articleTypeId: Types.ObjectId =
        articleTypeDoc._id as Types.ObjectId;

      const categoryDoc = await Category.findOne({ name: row.Category });
      if (!categoryDoc) throw new Error(`Category not found: ${row.Category}`);
      const categoryId: Types.ObjectId = categoryDoc._id as Types.ObjectId;

      const colorDoc = await Color.findOne({ name: row.Color });
      if (!colorDoc) throw new Error(`Color not found: ${row.Color}`);
      const colorId: Types.ObjectId = colorDoc._id as Types.ObjectId;

      const seasonDoc = await Season.findOne({ name: row.Season });
      if (!seasonDoc) throw new Error(`Season not found: ${row.Season}`);
      const seasonId: Types.ObjectId = seasonDoc._id as Types.ObjectId;

      // ----------------- Create Product -----------------
      const productData: Partial<IProduct> = {
        title: row["Title"],
        description: row["Description"] || "",
        brand: brandId,
        articleType: articleTypeId,
        category: categoryId,
        color: colorId,
        season: seasonId,
        gender: row["Gender"],
        collectionName: row["Collection Name"],
        price: Number(row["Price"]),
        finalPrice: Number(row["Final Price"] || row["Price"]),
        variants: [
          {
            sku: row["Vendor SKU Code"],
            stock: Number(row["Stock"] || 0),
            price: Number(row["Price"]),
            finalPrice: Number(row["Final Price"] || row["Price"]),
            brandSize: row["Size"],
          },
        ],
        metadata: {
          styleId: row["Style Id"],
          styleGroupId: row["Style Group Id"],
          vendorSkuCode: row["Vendor SKU Code"],
          vendorArticleNumber: row["Vendor Article Number"],
        },
        fashionDetails: {
          pattern: row["Pattern"],
          usage: row["Usage"],
          occasion: row["Occasion"],
          year: Number(row["Year"]),
          ornamentation: row["Ornamentation"],
          border: row["Border"],
          careInstructions: row["Wash Care"],
        },
        setDetails: {
          sareeFabric: row["Saree Fabric"],
          blouseFabric: row["Blouse Fabric"],
          blouseIncluded: row["Blouse"]?.toLowerCase() === "yes",
          setType: row["Saree Type"],
        },
        multipackSet: row["Multipack Set"] === "1",
        tags: row["Tags"]
          ? row["Tags"].split(",").map((t: string) => t.trim())
          : [],
        images: imageUrls,
        seller: userId,
      };

      await Product.create(productData);
      validCount++;
    } catch (err: any) {
      errorRows.push({ rowNumber, reason: err.message, data: row });
      skippedCount++;
    }
  }

  // ----------------- Generate Error Excel -----------------
  let errorFilePath: string | undefined;
  if (errorRows.length > 0) {
    const errorWorkbook = XLSX.utils.book_new();
    const sheetData = errorRows.map((er) => ({
      Row: er.rowNumber,
      Reason: er.reason,
      ...er.data,
    }));
    const errorSheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(errorWorkbook, errorSheet, "Errors");

    const errorDir = path.join("uploads", "excel", "errors");
    if (!fs.existsSync(errorDir)) fs.mkdirSync(errorDir, { recursive: true });

    const fileName = `${path.basename(listing.filename, path.extname(listing.filename))}-errors.xlsx`;
    errorFilePath = path.join(errorDir, fileName);
    XLSX.writeFile(errorWorkbook, errorFilePath);
  }

  // ----------------- Update Listing -----------------
  listing.totalRows = totalRows;
  listing.validCount = validCount;
  listing.skippedCount = skippedCount;
  listing.errorCount = errorRows.length;
  listing.errorFilePath = errorFilePath;
  listing.status =
    errorRows.length === 0
      ? "success"
      : validCount === 0
        ? "failed"
        : "partial";

  await listing.save();
};

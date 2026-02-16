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
  }

  listing.status = "processing";
  await listing.save();

  const workbook = XLSX.readFile(listing.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // 🔥 IMPORTANT: defval keeps empty cells explicit
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
  });

  // 🔥 Detect template-only rows
  const isRowEmpty = (row: any) => {
    return !row.Title && !row["Vendor SKU Code"] && !row.Price;
  };

  // 🔥 Filter only rows that user actually filled
  const validRows = rows.filter((row) => !isRowEmpty(row));

  let totalRows = validRows.length;
  let validCount = 0;
  let skippedCount = 0;

  const errorRows: ErrorRow[] = [];

  for (let i = 0; i < validRows.length; i++) {
    const row = validRows[i];

    // preserve original Excel row number
    const rowNumber = rows.indexOf(row) + 2;

    try {
      // ----------------- Validate required fields -----------------
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
      const exists = await Product.findOne({
        "variants.sku": row["Vendor SKU Code"],
      });

      if (exists) {
        errorRows.push({
          rowNumber,
          reason: "Duplicate SKU",
          data: row,
        });
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
            await sharp(buffer).metadata();

            const uploaded = await uploadBufferToCloudinary(
              buffer,
              row["Vendor SKU Code"],
            );

            imageUrls.push(uploaded.secure_url);
          } catch (err: any) {
            throw new Error(`Image error for ${url}: ${err.message}`);
          }
        }
      }

      // ----------------- Fetch related documents -----------------
      const brandDoc = await Brands.findOne({ name: row.Brand });
      if (!brandDoc) throw new Error(`Brand not found: ${row.Brand}`);

      const articleTypeDoc = await ArticleType.findOne({
        name: row["Article Type"],
      });
      if (!articleTypeDoc)
        throw new Error(`Article Type not found: ${row["Article Type"]}`);

      const categoryDoc = await Category.findOne({ name: row.Category });
      if (!categoryDoc) throw new Error(`Category not found: ${row.Category}`);

      const colorDoc = await Color.findOne({ name: row.Color });
      if (!colorDoc) throw new Error(`Color not found: ${row.Color}`);

      const seasonDoc = await Season.findOne({ name: row.Season });
      if (!seasonDoc) throw new Error(`Season not found: ${row.Season}`);

      // ----------------- Create Product -----------------
      const productData: Partial<IProduct> = {
        title: row.Title,
        description: row.Description || "",
        brand: brandDoc._id as Types.ObjectId,
        articleType: articleTypeDoc._id as Types.ObjectId,
        category: categoryDoc._id as Types.ObjectId,
        color: colorDoc._id as Types.ObjectId,
        season: seasonDoc._id as Types.ObjectId,
        gender: row.Gender,
        collectionName: row["Collection Name"],
        price: Number(row.Price),
        finalPrice: Number(row["Final Price"] || row.Price),
        variants: [
          {
            sku: row["Vendor SKU Code"],
            stock: Number(row.Stock || 0),
            price: Number(row.Price),
            finalPrice: Number(row["Final Price"] || row.Price),
            brandSize: row.Size,
          },
        ],
        metadata: {
          styleId: row["Style Id"],
          styleGroupId: row["Style Group Id"],
          vendorSkuCode: row["Vendor SKU Code"],
          vendorArticleNumber: row["Vendor Article Number"],
        },
        fashionDetails: {
          pattern: row.Pattern,
          usage: row.Usage,
          occasion: row.Occasion,
          year: Number(row.Year),
          ornamentation: row.Ornamentation,
          border: row.Border,
          careInstructions: row["Wash Care"],
        },
        setDetails: {
          sareeFabric: row["Saree Fabric"],
          blouseFabric: row["Blouse Fabric"],
          blouseIncluded: row.Blouse?.toLowerCase() === "yes",
          setType: row["Saree Type"],
        },
        multipackSet: row["Multipack Set"] === "1",
        tags: row.Tags ? row.Tags.split(",").map((t: string) => t.trim()) : [],
        images: imageUrls,
        seller: userId,
      };

      await Product.create(productData);
      validCount++;
    } catch (err: any) {
      errorRows.push({
        rowNumber,
        reason: err.message,
        data: row,
      });
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

    const fileName = `${path.basename(
      listing.filename,
      path.extname(listing.filename),
    )}-errors.xlsx`;

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

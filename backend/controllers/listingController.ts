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



import ExcelJS from "exceljs";
import Category from "../models/Category";
import Color from "../models/Color";
import Season from "../models/Season";
import Brands from "../models/Brands";
import ArticleType from "../models/ArticleType";

// Define constant pattern options
const PATTERN_OPTIONS = [
  "Solid",
  "Striped",
  "Checked",
  "Printed",
  "Polka Dot",
  "Floral",
  "Geometric",
  "Abstract",
];

export const FABRIC = [
  "Cotton",
  "Silk",
  "Chiffon",
  "Georgette",
  "Linen",
  "Crepe",
  "Satin",
  "Polyester",
  "Wool",
  "Velvet",
  "Net",
  "Rayon",
  "Jute",
  "Organza",
  "Khadi",
];
export const SIZE: string[] = ["ONE", "30", "32", "34", "36", "38", "40"]; // unique sizes only

export const downloadExcelTemplate = async (req: Request, res: Response) => {
  try {
    // Fetch all dropdown data
    const [brands, articleTypes, categories, colors, seasons] =
      await Promise.all([
        Brands.find().select("name -_id").lean(),
        ArticleType.find().select("name -_id").lean(),
        Category.find().select("name -_id").lean(),
        Color.find().select("name -_id").lean(),
        Season.find().select("name -_id").lean(),
      ]);

    const brandNames = brands.map((b) => b.name);
    const articleTypeNames = articleTypes.map((a) => a.name);
    const categoryNames = categories.map((c) => c.name);
    const colorNames = colors.map((c) => c.name);
    const seasonNames = seasons.map((s) => s.name);
    const genderOptions = ["Mens", "Womens", "Boys", "Girls", "Unisex"];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Product Template");

    // Add header row (Pattern added after Color)
    worksheet.addRow([
      "Title",
      "Description",
      "Style Id",
      "Style Group Id",
      "Vendor SKU Code",
      "Vendor Article Number",
      "Brand",
      "Article Type",
      "Category",
      "Color",
      "Pattern", // NEW COLUMN
      "Season",
      "Gender",
      "Year",
      "Collection Name",
      "Price",
      "Final Price",
      "SKU",
      "Stock",
      "Variant Price",
      "Variant Final Price",
      "Tags",
      "Images",
    ]);

    // Pre-fill rows for dropdowns
    const totalRows = 100; // number of products in template
    for (let i = 0; i < totalRows; i++) {
      worksheet.addRow(new Array(23).fill(""));
    }

    // Apply dropdowns to relevant columns
    for (let i = 2; i <= totalRows + 1; i++) {
      worksheet.getCell(`G${i}`).dataValidation = {
        // Brand
        type: "list",
        allowBlank: true,
        formulae: [`"${brandNames.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Brand",
        error: "Select a brand from the dropdown",
      };
      worksheet.getCell(`H${i}`).dataValidation = {
        // Article Type
        type: "list",
        allowBlank: true,
        formulae: [`"${articleTypeNames.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Article Type",
        error: "Select an article type from the dropdown",
      };
      worksheet.getCell(`I${i}`).dataValidation = {
        // Category
        type: "list",
        allowBlank: true,
        formulae: [`"${categoryNames.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Category",
        error: "Select a category from the dropdown",
      };
      worksheet.getCell(`J${i}`).dataValidation = {
        // Color
        type: "list",
        allowBlank: true,
        formulae: [`"${colorNames.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Color",
        error: "Select a color from the dropdown",
      };
      worksheet.getCell(`K${i}`).dataValidation = {
        // Pattern (NEW)
        type: "list",
        allowBlank: true,
        formulae: [`"${PATTERN_OPTIONS.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Pattern",
        error: "Select a pattern from the dropdown",
      };
      worksheet.getCell(`L${i}`).dataValidation = {
        // Season
        type: "list",
        allowBlank: true,
        formulae: [`"${seasonNames.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Season",
        error: "Select a season from the dropdown",
      };
      worksheet.getCell(`M${i}`).dataValidation = {
        // Gender
        type: "list",
        allowBlank: true,
        formulae: [`"${genderOptions.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Invalid Gender",
        error: "Select gender from the dropdown",
      };
    }

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    worksheet.columns.forEach((col) => (col.width = 20));

    // Send file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=product-template.xlsx",
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel generation error:", error);
    res.status(500).send("Error generating Excel template");
  }
};

// Common dropdowns
const GENDER_OPTIONS = ["Mens", "Womens", "Boys", "Girls", "Unisex"];
const FASHION_TYPE_OPTIONS = ["Casual", "Formal", "Ethnic", "Party", "Sports"];
const SAREE_TYPES = [
  "Arani",
  "Bagh",
  "Bagru",
  "Baluchari",
  "Banarasi",
  "Bandhani",
  "Bhagalpuri",
  "Block Print",
  "Bomkai silk",
  "Chanderi",
  "Chettinad",
  "Dabu",
  "Dharmavaram",
  "Gadwal",
  "Garad",
  "Ikat",
  "Ilkal",
  "Jamdani",
  "Kanjeevaram",
  "Kasavu",
  "Khadi",
  "Kota",
  "Kovai",
  "Laal Paar",
  "Leheriya",
  "Maheshwari",
  "Mangalagiri",
  "Muga",
  "Murshidabad silk",
  "Mysore Silk",
  "NA",
  "Narayan Peth",
  "Paithani",
  "Patola",
  "Pochampally",
  "Sambalpuri",
  "Sungudi",
  "Taant",
  "Tussar",
  "Uppada",
  "Venkatgiri",
];
const USAGES_OPTION = [
  "Casual",
  "Ethnic",
  "Formal",
  "Home",
  "NA",
  "Party",
  "Smart Casual",
  "Sports",
  "Travel",
];
const BLOUSE_OPTION = ["NA", "Stitched", "Not Stitched"];
const ORNAMENTATION_OPTION = [
  "Aari Work",
  "Beads and Stones",
  "Chikankari",
  "Embroidered",
  "Gotta Patti",
  "Jaali",
  "Kashida",
  "Kutchi Embroidery",
  "Mirror Work",
  "Mukaish",
  "NA",
  "Patchwork",
  "Phulkari",
  "Schiffli",
  "Sequinned",
  "Zardozi",
  "Zari",
];
const BORDER_OPTION = [
  "Checked",
  "Embellished",
  "Embroidered",
  "No Border",
  "Printed",
  "Scallop",
  "Solid",
  "Striped",
  "Woven Design",
  "Zari",
];
const OCATION_OPTION = [
  "Daily",
  "Party",
  "Traditional",
  "Festive",
  "Work",
  "Fusion",
];
const WASHCARE_OPTION = ["Hand Wash", "Machine Wash", "Dry Clean"];
const MULTIPACKSET_OPTION = ["NA", "2", "3", "4", "5"];

// Define headers per article type
const ARTICLE_TYPE_HEADERS: Record<string, string[]> = {
  sarees: [
    "Title",
    "Description",
    "Style Id",
    "Style Group Id",
    "Vendor SKU Code",
    "Vendor Article Number",
    "Season",
    "Brand",
    "Gender",
    "Category",
    "Article Type",
    "Color",
    "Pattern",
    "Size",
    "Saree Type",
    "Saree Fabric",
    "Blouse Fabric",
    "Blouse",
    "Wash Care",
    "Ornamentation",
    "Border",
    "Multipack Set",
    "Net Quantity",
    "Price",
    "Final Price",
    "Year",
    "Tags",
    "HSN",
    "Usage",
    "Occasion",
    "Style Note",
    "Collection Name",
    "Images",
  ],
  shirt: [
    "Title",
    "Description",
    "Style Id",
    "Style Group Id",
    "Vendor SKU Code",
    "Vendor Article Number",
    "Brand",
    "Article Type",
    "Category",
    "Color",
    "Pattern",
    "Fashion Type",
    "Print Type",
    "Occasion",
    "Season",
    "Gender",
    "Year",
    "Collection Name",
    "Price",
    "Final Price",
    "SKU",
    "Stock",
    "Variant Price",
    "Variant Final Price",
    "Tags",
    "Images",
  ],
  trousers: [
    "Title",
    "Description",
    "Style Id",
    "Style Group Id",
    "Vendor SKU Code",
    "Vendor Article Number",
    "Brand",
    "Article Type",
    "Category",
    "Color",
    "Pattern",
    "Fashion Type",
    "Size & Fit",
    "Season",
    "Gender",
    "Year",
    "Collection Name",
    "Price",
    "Final Price",
    "SKU",
    "Stock",
    "Variant Price",
    "Variant Final Price",
    "Tags",
    "Images",
  ],
};

export const articleTypedownloadExcelTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { articleType } = req.query;
    if (!articleType || typeof articleType !== "string") {
      res.status(400).send("Article Type is required in query");
      return;
    }

    const selectedArticleType = articleType.toLowerCase();
    const headers = ARTICLE_TYPE_HEADERS[selectedArticleType];
    if (!headers) {
      res.status(400).send("Invalid article type");
      return;
    }

    // Fetch dropdown data
    const [brands, articleTypes, categories, colors, seasons] =
      await Promise.all([
        Brands.find().select("name -_id").lean(),
        ArticleType.find().select("name -_id").lean(),
        Category.find().select("name -_id").lean(),
        Color.find().select("name -_id").lean(),
        Season.find().select("name -_id").lean(),
      ]);

    const brandNames = brands.map((b) => b.name);
    const articleTypeNames = articleTypes.map((a) => a.name);
    const categoryNames = categories.map((c) => c.name);
    const colorNames = colors.map((c) => c.name);
    const seasonNames = seasons.map((s) => s.name);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Product Template");

    // Add header row
    worksheet.addRow(headers);

    // Pre-fill empty rows
    const totalRows = 50;
    for (let i = 0; i < totalRows; i++) {
      worksheet.addRow(new Array(headers.length).fill(""));
    }

    // Create hidden sheet for long dropdowns
    const hiddenSheet = workbook.addWorksheet("HiddenLists");
    hiddenSheet.state = "veryHidden";

    const createHiddenList = (list: string[], colStart: number) => {
      list.forEach((item, idx) => {
        hiddenSheet.getCell(idx + 1, colStart).value = item;
      });
    };

    createHiddenList(brandNames, 1);
    createHiddenList(articleTypeNames, 2);
    createHiddenList(categoryNames, 3);
    createHiddenList(colorNames, 4);
    createHiddenList(seasonNames, 5);
    createHiddenList(GENDER_OPTIONS, 6);
    createHiddenList(PATTERN_OPTIONS, 7);
    createHiddenList(FABRIC, 8);
    createHiddenList(FABRIC, 9);
    createHiddenList(SIZE, 10);
    createHiddenList(SAREE_TYPES, 11);
    createHiddenList(USAGES_OPTION, 12);
    createHiddenList(BLOUSE_OPTION, 13);
    createHiddenList(ORNAMENTATION_OPTION, 14);
    createHiddenList(BORDER_OPTION, 15);
    createHiddenList(OCATION_OPTION, 16);
    createHiddenList(WASHCARE_OPTION, 17);
    createHiddenList(MULTIPACKSET_OPTION, 18);

    // Map headers to columns
    const colMap: Record<string, number> = {
      Brand: headers.indexOf("Brand") + 1,
      ArticleType: headers.indexOf("Article Type") + 1,
      Category: headers.indexOf("Category") + 1,
      Color: headers.indexOf("Color") + 1,
      Season: headers.indexOf("Season") + 1,
      Gender: headers.indexOf("Gender") + 1,
      Pattern: headers.indexOf("Pattern") + 1,
      SareeFabric: headers.indexOf("Saree Fabric") + 1,
      BlouseFabric: headers.indexOf("Blouse Fabric") + 1,
      Size: headers.indexOf("Size") + 1,
      SareeType: headers.indexOf("Saree Type") + 1,
      Usages: headers.indexOf("Usage") + 1,
      Blouses: headers.indexOf("Blouse") + 1,
      Ornamentations: headers.indexOf("Ornamentation") + 1,
      Borders: headers.indexOf("Border") + 1,
      Ocations: headers.indexOf("Occasion") + 1,
      WashCare: headers.indexOf("Wash Care") + 1,
      MultiPackSet: headers.indexOf("Multipack Set") + 1,
    };

    // Apply data validation using hidden lists
    for (let i = 2; i <= totalRows + 1; i++) {
      if (colMap.Brand)
        worksheet.getCell(i, colMap.Brand).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$A$1:$A$${brandNames.length}`],
        };
      if (colMap.ArticleType)
        worksheet.getCell(i, colMap.ArticleType).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$B$1:$B$${articleTypeNames.length}`],
        };
      if (colMap.Category)
        worksheet.getCell(i, colMap.Category).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$C$1:$C$${categoryNames.length}`],
        };
      if (colMap.Color)
        worksheet.getCell(i, colMap.Color).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$D$1:$D$${colorNames.length}`],
        };
      if (colMap.Season)
        worksheet.getCell(i, colMap.Season).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$E$1:$E$${seasonNames.length}`],
        };
      if (colMap.Gender)
        worksheet.getCell(i, colMap.Gender).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$F$1:$F$${GENDER_OPTIONS.length}`],
        };
      if (colMap.Pattern)
        worksheet.getCell(i, colMap.Pattern).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$G$1:$G$${PATTERN_OPTIONS.length}`],
        };
      if (colMap.SareeFabric)
        worksheet.getCell(i, colMap.SareeFabric).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$H$1:$H$${FABRIC.length}`],
        };
      if (colMap.BlouseFabric)
        worksheet.getCell(i, colMap.BlouseFabric).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$I$1:$I$${FABRIC.length}`],
        };
      if (colMap.Size)
        worksheet.getCell(i, colMap.Size).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$J$1:$J$${SIZE.length}`],
        };
      if (colMap.SareeType)
        worksheet.getCell(i, colMap.SareeType).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$K$1:$K$${SAREE_TYPES.length}`],
        };
      if (colMap.Usages)
        worksheet.getCell(i, colMap.Usages).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$L$1:$L$${USAGES_OPTION.length}`],
        };
      if (colMap.Blouses)
        worksheet.getCell(i, colMap.Blouses).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$M$1:$M$${BLOUSE_OPTION.length}`],
        };
      if (colMap.Ornamentations)
        worksheet.getCell(i, colMap.Ornamentations).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$N$1:$N$${ORNAMENTATION_OPTION.length}`],
        };
      if (colMap.Borders)
        worksheet.getCell(i, colMap.Borders).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$O$1:$O$${BORDER_OPTION.length}`],
        };
      if (colMap.Ocations)
        worksheet.getCell(i, colMap.Ocations).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$P$1:$P$${OCATION_OPTION.length}`],
        };
      if (colMap.WashCare)
        worksheet.getCell(i, colMap.WashCare).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$Q$1:$Q$${WASHCARE_OPTION.length}`],
        };
      if (colMap.MultiPackSet)
        worksheet.getCell(i, colMap.MultiPackSet).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`HiddenLists!$R$1:$R$${MULTIPACKSET_OPTION.length}`],
        };
    }

    // Style header and set column widths
    worksheet.getRow(1).font = { bold: true };
    worksheet.columns.forEach((col) => (col.width = 20));

    // Send Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=product-template-${selectedArticleType}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel generation error:", error);
    res.status(500).send("Error generating Excel template");
  }
};

import { Request, Response } from "express";
import XLSX from "xlsx";
import User, { IUser } from "../models/User";
import { response } from "../utils/responseHandler";
import bcrypt from "bcryptjs";

export const importUsersFromExcel = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return response(res, 400, "Excel file is required");
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return response(res, 400, "Excel file is empty");
    }

    const errors: any[] = [];
    const usersToInsert: IUser[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row: any = rows[i];

      try {
        // ===== Basic validations =====
        if (!row.Name) throw "Name is required";
        if (!row.Email) throw "Email is required";
        if (!row.Password) throw "Password is required";
        if (row.Role && !["user", "admin"].includes(row.Role))
          throw "Role must be user or admin";

        // ===== Check if email already exists =====
        const existingUser = await User.findOne({ email: row.Email });
        if (existingUser) throw "Email already exists";

        // ===== Hash password =====
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(row.Password, salt);

        // ===== Build user object =====
        const user: Partial<IUser> = {
          name: row.Name,
          email: row.Email,
          password: hashedPassword,
          phoneNumber: row["Phone Number"] || null,
          isVerified: row["Is Verified"] === "true" || false,
          agreeTerms: row["Agree Terms"] === "true" || false,
          role: row.Role || "user",
        };

        usersToInsert.push(user as IUser);
      } catch (err: any) {
        errors.push({
          row: i + 2, // Excel row number (header is row 1)
          message: err.toString(),
        });
      }
    }

    if (errors.length > 0) {
      return response(res, 400, "Validation failed", { errors });
    }

    await User.insertMany(usersToInsert);

    return response(res, 201, "Users imported successfully", {
      count: usersToInsert.length,
    });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Error importing users");
  }
};

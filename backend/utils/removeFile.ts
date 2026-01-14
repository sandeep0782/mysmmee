import fs from "fs";

export const removeLocalFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error removing local file:", err);
  });
};

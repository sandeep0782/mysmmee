import sharp from "sharp";
import { BANNER_RULES } from "../config/bannerRules";

export const validateBannerImage = async (filePath: string) => {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid image file");
  }

  // Orientation
  if (metadata.width <= metadata.height) {
    throw new Error("Banner must be landscape");
  }

  // Resolution
  if (
    metadata.width < BANNER_RULES.minWidth ||
    metadata.height < BANNER_RULES.minHeight
  ) {
    throw new Error(
      `Minimum resolution is ${BANNER_RULES.minWidth}×${BANNER_RULES.minHeight}`
    );
  }

  // Aspect ratio
  const actualRatio = metadata.width / metadata.height;
  const expected = BANNER_RULES.aspectRatio;
  const tolerance = BANNER_RULES.tolerance;

  if (
    actualRatio < expected * (1 - tolerance) ||
    actualRatio > expected * (1 + tolerance)
  ) {
    throw new Error("Invalid aspect ratio. Required 3:2");
  }

  return true;
};

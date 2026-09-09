"use server";

import sharp from "sharp";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB — generous since we compress before storing
const MAX_DIMENSION = 1200; // px, long edge
const JPEG_QUALITY = 78;

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Image must be smaller than 8MB" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const compressed = await sharp(Buffer.from(arrayBuffer))
      .rotate() // apply EXIF orientation before stripping metadata
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();

    const dataUri = `data:image/jpeg;base64,${compressed.toString("base64")}`;

    return { success: true, url: dataUri };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

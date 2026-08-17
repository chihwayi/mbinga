"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!process.env.CLOUDINARY_API_SECRET) {
      return { success: false, error: "Image uploads are not configured (missing Cloudinary credentials)" };
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "mbinga-products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        }
      );
      uploadStream.end(buffer);
    });

    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

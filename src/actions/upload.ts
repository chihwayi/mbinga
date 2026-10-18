"use server";

import sharp from "sharp";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB — generous since we compress before storing
const MAX_DIMENSION = 1200; // px, long edge
const JPEG_QUALITY = 78;

async function compressToDataUri(buffer: Buffer): Promise<string> {
  const compressed = await sharp(buffer)
    .rotate() // apply EXIF orientation before stripping metadata
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  return `data:image/jpeg;base64,${compressed.toString("base64")}`;
}

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
    const dataUri = await compressToDataUri(Buffer.from(arrayBuffer));

    return { success: true, url: dataUri };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

// Fetches an externally-hosted image and stores it the same way as a direct
// upload (compressed, base64-encoded in the DB) — so a pasted URL doesn't
// leave the product depending on a third-party host staying online.
export async function uploadImageFromUrl(url: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { success: false, error: "URL must start with http:// or https://" };
    }

    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      return { success: false, error: `Could not fetch image (HTTP ${res.status})` };
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return { success: false, error: "That URL did not return an image" };
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
      return { success: false, error: "Image must be smaller than 8MB" };
    }

    const dataUri = await compressToDataUri(Buffer.from(arrayBuffer));

    return { success: true, url: dataUri };
  } catch (error) {
    console.error("Upload-from-URL error:", error);
    return { success: false, error: "Failed to fetch and store that image" };
  }
}

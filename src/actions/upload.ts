"use server";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

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
      return { success: false, error: "Image must be smaller than 3MB" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    return { success: true, url: dataUri };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

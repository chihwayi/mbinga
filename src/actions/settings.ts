"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { DEFAULT_SETTINGS, type SettingsKey } from "@/lib/settingsDefaults";

export async function getSettings(): Promise<typeof DEFAULT_SETTINGS> {
  const rows = await prisma.setting.findMany();
  const values = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if (row.key in values) {
      values[row.key as SettingsKey] = row.value;
    }
  }
  return values;
}

export async function updateSettings(
  prevState: string | undefined,
  formData: FormData,
): Promise<string> {
  const session = await auth();
  if (!session) return "Unauthorized.";

  for (const key of Object.keys(DEFAULT_SETTINGS) as SettingsKey[]) {
    const value = formData.get(key);
    if (typeof value === "string") {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return "success";
}

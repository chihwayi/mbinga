"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Product } from "@prisma/client";

// ─── Row → TypeScript shape ───────────────────────────────────────────────────
// Notes/ingredients are stored as JSON arrays, but older seed rows used plain
// comma-separated strings — fall back to splitting on those.
function parseList(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // not JSON — fall through to comma-split
  }
  return value.split(",").map(s => s.trim()).filter(Boolean)
}

function mapRow(row: Product) {
  return {
    ...row,
    notes: parseList(row.notes),
    ingredients: parseList(row.ingredients),
  }
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const notes       = (formData.get("notes") as string).split(",").map(s => s.trim()).filter(Boolean)
  const ingredients = (formData.get("ingredients") as string).split(",").map(s => s.trim()).filter(Boolean)

  await prisma.product.create({
    data: {
      name:        formData.get("name") as string,
      slug:        formData.get("slug") as string,
      tagline:     formData.get("tagline") as string,
      description: formData.get("description") as string,
      story:       formData.get("story") as string,
      category:    formData.get("category") as string,
      price:       parseFloat(formData.get("price") as string),
      stock:       parseInt(formData.get("stock") as string),
      notes:       JSON.stringify(notes),
      ingredients: JSON.stringify(ingredients),
      image:       formData.get("image") as string,
      accentColor: formData.get("accentColor") as string,
    },
  })

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const slug        = formData.get("slug") as string
  const notes       = (formData.get("notes") as string).split(",").map(s => s.trim()).filter(Boolean)
  const ingredients = (formData.get("ingredients") as string).split(",").map(s => s.trim()).filter(Boolean)

  await prisma.product.update({
    where: { id },
    data: {
      name:        formData.get("name") as string,
      slug,
      tagline:     formData.get("tagline") as string,
      description: formData.get("description") as string,
      story:       formData.get("story") as string,
      category:    formData.get("category") as string,
      price:       parseFloat(formData.get("price") as string),
      stock:       parseInt(formData.get("stock") as string),
      notes:       JSON.stringify(notes),
      ingredients: JSON.stringify(ingredients),
      image:       formData.get("image") as string,
      accentColor: formData.get("accentColor") as string,
    },
  })

  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.product.delete({ where: { id } })

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function getProducts() {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map(mapRow)
}

export async function getProductBySlug(slug: string) {
  const row = await prisma.product.findUnique({ where: { slug } })
  if (!row) return null
  return mapRow(row)
}

export async function getProductById(id: string) {
  const row = await prisma.product.findUnique({ where: { id } })
  if (!row) return null
  return mapRow(row)
}

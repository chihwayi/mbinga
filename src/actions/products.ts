"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { usdToZar } from "@/lib/currency";
import type { Product, ProductVariant } from "@prisma/client";

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

function mapRow(row: Product & { variants: ProductVariant[] }) {
  return {
    ...row,
    notes: parseList(row.notes),
    ingredients: parseList(row.ingredients),
    variants: row.variants.map(v => ({ id: v.id, sizeMl: v.sizeMl, priceUsd: v.priceUsd, priceZar: v.priceZar, stock: v.stock })),
  }
}

interface VariantInput {
  sizeMl:   number;
  priceUsd: number;
  priceZar: number;
  stock:    number;
}

// The admin form serializes its variant rows (size/price/stock) as JSON into
// a single hidden field, since a plain FormData can't carry a nested array.
// Only USD is entered by the admin — ZAR is always derived from it using the
// fixed rate, so the two currencies can never drift out of sync.
function parseVariants(formData: FormData): VariantInput[] {
  const raw = formData.get("variants") as string | null
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(v => ({
        sizeMl:   Number(v.sizeMl),
        priceUsd: Number(v.priceUsd),
        priceZar: usdToZar(Number(v.priceUsd)),
        stock:    Number(v.stock),
      }))
      .filter(v => Number.isFinite(v.sizeMl) && v.sizeMl > 0 && Number.isFinite(v.priceUsd))
  } catch {
    return []
  }
}

// Discount inputs come from three separate form fields (percent, starts,
// ends) rather than the single JSON blob used for variants, since they're
// plain scalar inputs in the form.
function parseDiscount(formData: FormData) {
  const percentRaw = formData.get("discountPercent") as string | null
  const startsRaw  = formData.get("discountStartsAt") as string | null
  const endsRaw    = formData.get("discountEndsAt") as string | null

  const percent = percentRaw && percentRaw.trim() !== "" ? Number(percentRaw) : null

  return {
    discountPercent:  percent && Number.isFinite(percent) && percent > 0 ? percent : null,
    discountStartsAt: startsRaw ? new Date(startsRaw) : null,
    discountEndsAt:   endsRaw ? new Date(endsRaw) : null,
  }
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const notes       = (formData.get("notes") as string).split(",").map(s => s.trim()).filter(Boolean)
  const ingredients = (formData.get("ingredients") as string).split(",").map(s => s.trim()).filter(Boolean)
  const variants     = parseVariants(formData)
  const discount     = parseDiscount(formData)

  await prisma.product.create({
    data: {
      name:        formData.get("name") as string,
      slug:        formData.get("slug") as string,
      tagline:     formData.get("tagline") as string,
      description: formData.get("description") as string,
      story:       formData.get("story") as string,
      category:    formData.get("category") as string,
      notes:       JSON.stringify(notes),
      ingredients: JSON.stringify(ingredients),
      image:       formData.get("image") as string,
      accentColor: formData.get("accentColor") as string,
      ...discount,
      variants: {
        create: variants.map(v => ({ sizeMl: v.sizeMl, priceUsd: v.priceUsd, priceZar: v.priceZar, stock: v.stock })),
      },
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
  const variants     = parseVariants(formData)
  const discount     = parseDiscount(formData)

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name:        formData.get("name") as string,
        slug,
        tagline:     formData.get("tagline") as string,
        description: formData.get("description") as string,
        story:       formData.get("story") as string,
        category:    formData.get("category") as string,
        notes:       JSON.stringify(notes),
        ingredients: JSON.stringify(ingredients),
        image:       formData.get("image") as string,
        accentColor: formData.get("accentColor") as string,
        ...discount,
      },
    })

    await tx.productVariant.deleteMany({ where: { productId: id } })

    for (const v of variants) {
      await tx.productVariant.create({
        data: { productId: id, sizeMl: v.sizeMl, priceUsd: v.priceUsd, priceZar: v.priceZar, stock: v.stock },
      })
    }
  })

  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/");
  redirect("/admin/products");
}

// Applies (or clears, when percent is null) the same discount to every
// product at once — used for storewide sales like the November launch
// promotion, so the admin doesn't have to edit each product individually.
export async function applyBulkDiscount(percent: number | null, startsAt: string | null, endsAt: string | null) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const result = await prisma.product.updateMany({
    data: {
      discountPercent:  percent && percent > 0 ? percent : null,
      discountStartsAt: startsAt ? new Date(startsAt) : null,
      discountEndsAt:   endsAt ? new Date(endsAt) : null,
    },
  })

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, updated: result.count };
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.product.delete({ where: { id } })

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function getProducts() {
  const rows = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(mapRow)
}

export async function getProductBySlug(slug: string) {
  const row = await prisma.product.findUnique({ where: { slug }, include: { variants: true } })
  if (!row) return null
  return mapRow(row)
}

export async function getProductById(id: string) {
  const row = await prisma.product.findUnique({ where: { id }, include: { variants: true } })
  if (!row) return null
  return mapRow(row)
}

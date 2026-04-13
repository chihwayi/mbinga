"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// ─── Row → TypeScript shape ───────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any) {
  return {
    id:          row.id as string,
    name:        row.name as string,
    slug:        row.slug as string,
    tagline:     row.tagline as string,
    description: row.description as string,
    story:       row.story as string,
    category:    row.category as string,
    price:       Number(row.price),
    stock:       Number(row.stock),
    notes:       Array.isArray(row.notes) ? row.notes as string[] : [],
    ingredients: Array.isArray(row.ingredients) ? row.ingredients as string[] : [],
    image:       row.image as string,
    accentColor: row.accent_color as string,
    createdAt:   row.created_at ? new Date(row.created_at) : undefined,
    updatedAt:   row.updated_at ? new Date(row.updated_at) : undefined,
  }
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const notes       = (formData.get("notes") as string).split(",").map(s => s.trim()).filter(Boolean)
  const ingredients = (formData.get("ingredients") as string).split(",").map(s => s.trim()).filter(Boolean)

  const { error } = await supabase.from("products").insert({
    name:         formData.get("name") as string,
    slug:         formData.get("slug") as string,
    tagline:      formData.get("tagline") as string,
    description:  formData.get("description") as string,
    story:        formData.get("story") as string,
    category:     formData.get("category") as string,
    price:        parseFloat(formData.get("price") as string),
    stock:        parseInt(formData.get("stock") as string),
    notes,
    ingredients,
    image:        formData.get("image") as string,
    accent_color: formData.get("accentColor") as string,
  })

  if (error) throw new Error(error.message)

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

  const { error } = await supabase.from("products").update({
    name:         formData.get("name") as string,
    slug,
    tagline:      formData.get("tagline") as string,
    description:  formData.get("description") as string,
    story:        formData.get("story") as string,
    category:     formData.get("category") as string,
    price:        parseFloat(formData.get("price") as string),
    stock:        parseInt(formData.get("stock") as string),
    notes,
    ingredients,
    image:        formData.get("image") as string,
    accent_color: formData.get("accentColor") as string,
  }).eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) return null
  return mapRow(data)
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return mapRow(data)
}

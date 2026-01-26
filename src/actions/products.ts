"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const story = formData.get("story") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const notes = formData.get("notes") as string;
  const ingredients = formData.get("ingredients") as string;
  const image = formData.get("image") as string;
  const accentColor = formData.get("accentColor") as string;

  await prisma.product.create({
    data: {
      name,
      slug,
      tagline,
      description,
      story,
      category,
      price,
      stock,
      notes,
      ingredients,
      image,
      accentColor,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const story = formData.get("story") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const notes = formData.get("notes") as string;
  const ingredients = formData.get("ingredients") as string;
  const image = formData.get("image") as string;
  const accentColor = formData.get("accentColor") as string;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      tagline,
      description,
      story,
      category,
      price,
      stock,
      notes,
      ingredients,
      image,
      accentColor,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

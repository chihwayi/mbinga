import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const fieldMap: Record<string, string> = {
  title:       "title",
  subtitle:    "subtitle",
  image_url:   "imageUrl",
  cta_text:    "ctaText",
  cta_link:    "ctaLink",
  order_index: "orderIndex",
  is_active:   "isActive",
};

// PATCH /api/admin/hero-slides/[id] — toggle active or update fields
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (fieldMap[key]) data[fieldMap[key]] = value;
  }

  try {
    await prisma.heroSlide.update({ where: { id }, data });
  } catch {
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/hero-slides/[id] — delete a slide
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.heroSlide.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

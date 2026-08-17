import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSlideDTO } from "@/lib/heroSlide";

// POST /api/admin/hero-slides — create a new slide
export async function POST(request: Request) {
  const body = await request.json();
  const { title, subtitle, image_url, cta_text, cta_link, order_index, is_active } = body;

  if (!image_url) {
    return NextResponse.json({ error: "image_url is required" }, { status: 400 });
  }

  const slide = await prisma.heroSlide.create({
    data: {
      title,
      subtitle,
      imageUrl:   image_url,
      ctaText:    cta_text,
      ctaLink:    cta_link,
      orderIndex: order_index,
      isActive:   is_active,
    },
  });

  return NextResponse.json({ slide: toSlideDTO(slide) }, { status: 201 });
}

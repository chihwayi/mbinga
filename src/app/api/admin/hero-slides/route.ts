import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/admin/hero-slides — create a new slide
export async function POST(request: Request) {
  const body = await request.json();
  const { title, subtitle, image_url, cta_text, cta_link, order_index, is_active } = body;

  if (!image_url) {
    return NextResponse.json({ error: "image_url is required" }, { status: 400 });
  }

  const { data: slide, error } = await supabase
    .from("hero_slides")
    .insert({ title, subtitle, image_url, cta_text, cta_link, order_index, is_active })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slide }, { status: 201 });
}

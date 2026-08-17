import type { HeroSlide } from "@prisma/client";

// Client components expect the same snake_case shape the old Supabase rows had.
export function toSlideDTO(slide: HeroSlide) {
  return {
    id:          slide.id,
    title:       slide.title,
    subtitle:    slide.subtitle,
    image_url:   slide.imageUrl,
    cta_text:    slide.ctaText,
    cta_link:    slide.ctaLink,
    order_index: slide.orderIndex,
    is_active:   slide.isActive,
  };
}

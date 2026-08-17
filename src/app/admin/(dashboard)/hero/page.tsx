import { prisma } from "@/lib/prisma";
import { toSlideDTO } from "@/lib/heroSlide";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";

export default async function AdminHeroPage() {
  const rows = await prisma.heroSlide.findMany({ orderBy: { orderIndex: "asc" } });
  const slides = rows.map(toSlideDTO);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif text-white mb-2">Hero Slides</h2>
        <p className="text-white/40 font-light">
          Manage the homepage hero section images and text.
        </p>
      </div>
      <HeroSlidesManager initialSlides={slides ?? []} />
    </div>
  );
}

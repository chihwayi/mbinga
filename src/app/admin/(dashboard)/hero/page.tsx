import { supabase } from "@/lib/supabase";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";

export default async function AdminHeroPage() {
  const { data: slides } = await supabase
    .from("hero_slides")
    .select("*")
    .order("order_index", { ascending: true });

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

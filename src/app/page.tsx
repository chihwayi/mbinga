import { getProducts } from "@/actions/products";
import { getSettings } from "@/actions/settings";
import { prisma } from "@/lib/prisma";
import { toSlideDTO } from "@/lib/heroSlide";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BrandEssence from "@/components/home/BrandEssence";
import Collection from "@/components/home/Collection";
import Films from "@/components/home/Films";
import Story from "@/components/home/Story";
import Journal from "@/components/home/Journal";
import Contact from "@/components/home/Contact";
import LazyLoadWrapper from "@/components/ui/LazyLoadWrapper";

// Queries the DB directly, which isn't available during the Docker build
// (the persistent volume is only mounted at runtime), so this can't be
// statically prerendered.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, activeSlides, settings] = await Promise.all([
    getProducts(),
    prisma.heroSlide.findMany({
      where:   { isActive: true },
      orderBy: { orderIndex: "asc" },
    }),
    getSettings(),
  ])

  const slides = activeSlides.map(toSlideDTO)

  return (
    <main className="min-h-screen bg-black text-cream selection:bg-gold selection:text-black">
      <Navbar />
      <Hero slides={slides} />
      <BrandEssence />
      <Collection products={products} />
      <LazyLoadWrapper>
        <Films />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Story />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Journal />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Contact email={settings.contact_email} whatsapp={settings.contact_whatsapp} />
      </LazyLoadWrapper>
      <Footer />
    </main>
  );
}

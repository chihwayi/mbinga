import { getProducts } from "@/actions/products";
import { getSettings } from "@/actions/settings";
import { prisma } from "@/lib/prisma";
import { toSlideDTO } from "@/lib/heroSlide";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
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

  const prestigeProducts = products.filter(p => p.collection !== "breeze")
  const breezeProducts   = products.filter(p => p.collection === "breeze")

  return (
    <main className="min-h-screen bg-black text-cream selection:bg-gold selection:text-black">
      <Navbar />
      <Hero slides={slides} />
      <Collection
        id="collections"
        products={prestigeProducts}
        title="Prestige Collection"
        subtitle="Extrait de Parfum, housed in its own luxury box — our premium range."
      />
      <Collection
        id="breeze-collection"
        products={breezeProducts}
        title="Breeze Collection"
        subtitle="Eau de Parfum, lighter and more accessible — everyday MBINGA, no box."
      />
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

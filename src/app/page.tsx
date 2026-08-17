import { getProducts } from "@/actions/products";
import { prisma } from "@/lib/prisma";
import { toSlideDTO } from "@/lib/heroSlide";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BrandEssence from "@/components/home/BrandEssence";
import Collection from "@/components/home/Collection";
import Story from "@/components/home/Story";
import Journal from "@/components/home/Journal";
import Contact from "@/components/home/Contact";
import LazyLoadWrapper from "@/components/ui/LazyLoadWrapper";

export default async function Home() {
  const [products, activeSlides] = await Promise.all([
    getProducts(),
    prisma.heroSlide.findMany({
      where:   { isActive: true },
      orderBy: { orderIndex: "asc" },
    }),
  ])

  const slides = activeSlides.map(toSlideDTO)

  return (
    <main className="min-h-screen bg-black text-cream selection:bg-gold selection:text-black">
      <Navbar />
      <Hero slides={slides} />
      <BrandEssence />
      <Collection products={products} />
      <LazyLoadWrapper>
        <Story />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Journal />
      </LazyLoadWrapper>
      <LazyLoadWrapper>
        <Contact />
      </LazyLoadWrapper>
      <Footer />
    </main>
  );
}

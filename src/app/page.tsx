import prisma from "@/lib/db";
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
  const products = await prisma.product.findMany();
  
  // Transform for frontend
  const formattedProducts = products.map(p => ({
    ...p,
    notes: p.notes.split(", "),
    ingredients: p.ingredients.split(", ")
  }));

  return (
    <main className="min-h-screen bg-black text-cream selection:bg-gold selection:text-black">
      <Navbar />
      <Hero />
      <BrandEssence />
      <Collection products={formattedProducts} />
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

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/ui/Cursor";
import Hero from "@/components/home/Hero";
import BrandEssence from "@/components/home/BrandEssence";
import Collection from "@/components/home/Collection";
import Story from "@/components/home/Story";
import Journal from "@/components/home/Journal";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian text-cream selection:bg-gold selection:text-obsidian">
      <Cursor />
      <Navbar />
      <Hero />
      <BrandEssence />
      <Collection />
      <Story />
      <Journal />
      <Contact />
      <Footer />
    </main>
  );
}

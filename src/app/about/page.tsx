
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/ui/Cursor";

export const metadata: Metadata = {
  title: "About Us | MBINGA",
  description: "Born from the heart of Africa, defined by presence, refinement, and quiet authority.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-obsidian text-cream selection:bg-gold selection:text-white">
      <Cursor />
      <Navbar />
      
      <section className="pt-48 pb-24 px-8 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
            Our Story
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-12 text-cream">
            The Essence of <br />
            <span className="text-gold">MBINGA</span>
          </h1>
          
          <div className="space-y-8 text-lg md:text-xl font-light leading-relaxed text-white/80">
            <p>
              MBINGA is more than a fragrance house; it is a testament to the enduring power and elegance of African heritage. 
              Our name, derived from the Shona word for a wealthy, influential person or 'big boss', reflects our commitment 
              to creating scents that command attention and respect.
            </p>
            <p>
              Each fragrance is a meticulously crafted narrative, weaving together rare ingredients sourced from across the continent. 
              From the smoky depths of aged Oud to the vibrant warmth of African spices, our collections are designed for those 
              who walk with purpose and leave a lasting impression.
            </p>
            <p>
              We believe in the quiet authority of luxury. It does not need to shout; it is felt. It is in the weight of the glass, 
              the clarity of the scent, and the confidence it inspires. Welcome to the world of MBINGA.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

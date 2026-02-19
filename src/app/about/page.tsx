
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Us | MBINGA",
  description: "Born from the heart of Africa, defined by presence, refinement, and quiet authority.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-cream selection:bg-gold selection:text-white">
      <Navbar />
      
      <section className="pt-48 pb-24 px-8 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
            Our Story
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-12 text-cream">
            Born in the <br />
            <span className="text-gold">Heart of Africa</span>
          </h1>
          
          <div className="space-y-8 text-lg md:text-xl font-light leading-relaxed text-white/80">
            <p>
              Born in the heart of Africa — where the sun warms ancient soil and legacy is carried in the names we bear — MBINGA is more than a fragrance house. It is presence, identity, and earned distinction.
            </p>
            <p>
              In Shona culture, Mbinga speaks of strength, resilience, and a position earned through vision and action — a person of substance who commands respect without raising their voice. MBINGA perfumes carry this spirit: each scent embodies legacy, power, and quiet authority.
            </p>
            <p>
              Each fragrance is deliberate, layered, and intentional: smoky Oud, glowing amber, refined spice — crafted to leave a lasting impression.
            </p>
            <p>
              True luxury does not shout; it is felt — in the clarity of the blend and the confidence it awakens within you.
            </p>
            <p>
              From Africa to the world, distinction is not declared — it is lived.
            </p>
            <p>
              Welcome to MBINGA.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

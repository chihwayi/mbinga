import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import AddToCartSection from "@/components/product/AddToCartSection";

import Image from "next/image";

export async function generateStaticParams() {
  const products = await prisma.product.findMany();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Parse notes and ingredients from string to array
  const notes = product.notes.split(", ");
  const ingredients = product.ingredients.split(", ");

  return (
    <main className="min-h-screen bg-black text-cream selection:bg-gold selection:text-white">
      <Navbar />

      <div className="pt-24 min-h-screen flex flex-col md:flex-row">
        {/* Left: Visual/Image Area */}
        <div 
            className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden"
            style={{
                background: `radial-gradient(circle at center, ${product.accentColor}40 0%, #0E0E0E 70%)`
            }}
        >
            {/* <div className="absolute inset-0 bg-black/20" /> Removed dark overlay */}
            <div className="relative z-10 p-12 text-center">
                 <div className="relative w-80 h-[500px] mx-auto drop-shadow-2xl">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                        priority
                    />
                 </div>
            </div>
            <Link href="/" className="absolute top-8 left-8 text-white/60 hover:text-gold flex items-center gap-2 text-xs uppercase tracking-widest z-20 transition-colors">
                <ArrowLeft size={16} /> Back to Collection
            </Link>
        </div>

        {/* Right: Content Area */}
        <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center bg-obsidian border-l border-white/5">
            <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                {product.category} Collection
            </span>
            
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-cream">
                {product.name}
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-white/60 mb-8 italic font-serif">
                {product.tagline}
            </p>

            <div className="h-[1px] w-24 bg-gold mb-12" />

            <div className="mb-12 space-y-6">
                <h3 className="font-serif text-2xl text-gold">The Story</h3>
                <p className="text-white/80 leading-relaxed font-light text-lg">
                    {product.description}
                </p>
                <p className="text-white/80 leading-relaxed font-light text-lg">
                    {product.story}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12 border-t border-white/10 pt-8">
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gold mb-4">Olfactory Notes</h4>
                    <ul className="space-y-2">
                        {notes.map(note => (
                            <li key={note} className="text-white/70 font-light flex items-center gap-2">
                                <span className="w-1 h-1 bg-gold rounded-full" /> {note}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gold mb-4">Ingredients</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                        {ingredients.join(", ")}
                    </p>
                </div>
            </div>

            <AddToCartSection product={{
                ...product,
                notes: notes,
                ingredients: ingredients,
                category: product.category as "Men" | "Women" | "Unisex"
            }} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

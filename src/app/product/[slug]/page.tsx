import { products } from "@/data/products";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/ui/Cursor";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import AddToCartSection from "@/components/product/AddToCartSection";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-obsidian text-cream selection:bg-gold selection:text-obsidian">
      <Cursor />
      <Navbar />

      <div className="pt-24 min-h-screen flex flex-col md:flex-row">
        {/* Left: Visual/Image Area */}
        <div 
            className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen bg-gradient-to-br from-warm-grey to-obsidian flex items-center justify-center overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${product.accentColor}, #0A0A0A)`
            }}
        >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-12 text-center">
                 {/* Placeholder for bottle 3D or Image */}
                 <div className="w-64 h-96 border border-white/20 mx-auto backdrop-blur-sm bg-white/5 flex items-center justify-center">
                    <span className="text-white/30 font-serif text-xl tracking-widest uppercase rotate-90">Bottle Image</span>
                 </div>
            </div>
            <Link href="/" className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest z-20">
                <ArrowLeft size={16} /> Back to Collection
            </Link>
        </div>

        {/* Right: Content Area */}
        <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center">
            <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                {product.category} Collection
            </span>
            
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-cream">
                {product.name}
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-cream/80 mb-8 italic font-serif">
                {product.tagline}
            </p>

            <div className="h-[1px] w-24 bg-gold mb-12" />

            <div className="mb-12 space-y-6">
                <h3 className="font-serif text-2xl text-gold">The Story</h3>
                <p className="text-cream/70 leading-relaxed font-light text-lg">
                    {product.description}
                </p>
                <p className="text-cream/70 leading-relaxed font-light text-lg">
                    {product.story}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12 border-t border-white/10 pt-8">
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gold mb-4">Olfactory Notes</h4>
                    <ul className="space-y-2">
                        {product.notes.map(note => (
                            <li key={note} className="text-cream/80 font-light flex items-center gap-2">
                                <span className="w-1 h-1 bg-gold rounded-full" /> {note}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gold mb-4">Ingredients</h4>
                    <p className="text-cream/60 text-sm leading-relaxed">
                        {product.ingredients.join(", ")}
                    </p>
                </div>
            </div>

            <AddToCartSection product={product} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

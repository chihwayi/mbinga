import { getProductBySlug, getProducts } from "@/actions/products";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddToCartSection from "@/components/product/AddToCartSection";
import ProductImage from "@/components/product/ProductImage";
import { ProductVariantProvider } from "@/context/ProductVariantContext";
import { COLLECTION_LABELS } from "@/types";
import { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | MBINGA',
      description: 'The product you are looking for could not be found.',
    };
  }

  const notes = product.notes.slice(0, 3).join(", ");

  return {
    title: `${product.name} | MBINGA Luxury Fragrance`,
    description: `${product.tagline} Experience the essence of ${product.name} with notes of ${notes}. Crafted with African heritage and luxury refinement.`,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [product.image],
      type: 'website',
      siteName: 'MBINGA',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.tagline,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getProductBySlug(slug);

  if (!row) notFound();

  const product = {
    ...row,
    category: row.category as "Men" | "Women" | "Unisex",
    collection: row.collection as "prestige" | "breeze",
  };
  const isPrestige = product.collection === "prestige";

  return (
    <main className="min-h-screen bg-black text-cream selection:bg-gold selection:text-white">
      <Navbar />

      <ProductVariantProvider product={product}>
        <div className="pt-24 min-h-screen flex flex-col md:flex-row">
          {/* Left: Visual/Image Area */}
          <div
              className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden"
              style={{
                  background: `radial-gradient(circle at center, ${product.accentColor}40 0%, #0E0E0E 70%)`
              }}
          >
              <div className="relative z-10 p-6 md:p-12 text-center w-full">
                  <ProductImage />
              </div>
              <Link href="/" className="absolute top-8 left-8 text-white/60 hover:text-gold flex items-center gap-2 text-xs uppercase tracking-widest z-20 transition-colors">
                  <ArrowLeft size={16} /> Back to Collection
              </Link>
          </div>

          {/* Right: Content Area */}
          <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center bg-obsidian border-l border-white/5">
              <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
                  {COLLECTION_LABELS[product.collection]} · {product.category}
              </span>

              <h1 className="font-serif text-5xl md:text-7xl mb-4 text-cream">
                  {product.name}
              </h1>

              <p className="text-xl md:text-2xl font-light text-white/60 mb-8 italic font-serif">
                  {product.tagline}
              </p>

              <div className="h-[1px] w-24 bg-gold mb-12" />

              {isPrestige ? (
                  <div className="mb-10 pb-8 border-b border-white/10">
                      <p className="text-gold text-xs uppercase tracking-[0.25em] mb-2">
                          35% Fragrance Concentration | Extrait de Parfum
                      </p>
                      <p className="text-white/60 font-light leading-relaxed">
                          Crafted with a 35% fragrance oil concentration, MBINGA brings together the richness of fine perfumery and an expression of African-inspired luxury. Presented in its own luxury box.
                      </p>
                  </div>
              ) : (
                  <div className="mb-10 pb-8 border-b border-white/10">
                      <p className="text-gold text-xs uppercase tracking-[0.25em] mb-2">
                          25% Fragrance Concentration | Eau de Parfum
                      </p>
                      <p className="text-white/60 font-light leading-relaxed">
                          Crafted with a 25% fragrance oil concentration, Breeze is a lighter, more accessible expression of MBINGA — everyday luxury, without the outer presentation box.
                      </p>
                  </div>
              )}

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
                          {product.notes.map(note => (
                              <li key={note} className="text-white/70 font-light flex items-center gap-2">
                                  <span className="w-1 h-1 bg-gold rounded-full" /> {note}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-xs uppercase tracking-widest text-gold mb-4">Ingredients</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                          {product.ingredients.join(", ")}
                      </p>
                  </div>
              </div>

              <AddToCartSection />
          </div>
        </div>
      </ProductVariantProvider>
      <Footer />
    </main>
  );
}

"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useAnimation, useMotionValue } from "framer-motion";

interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  accentColor: string;
  category: string;
  notes: string[];
  image: string;
}

function getProductImage(product: Product) {
  let src = product.image || "";

  if (src.endsWith(".jpg")) {
    src = src.replace(".jpg", ".png");
  }

  if (product.slug === "uzoba-lit") {
    src = "/images/unoziba-lit.png";
  }

  return src;
}

export default function Collection({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const controls = useAnimation();
  const x = useMotionValue(0);

  // Auto-scroll functionality
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const scrollSpeed = 0.8; // Slightly increased speed
    let isHovering = false;
    let scrollPos = container.scrollLeft;

    const scroll = () => {
      if (!isHovering && container) {
        scrollPos += scrollSpeed;
        
        // Check if we've reached the end
        if (scrollPos >= container.scrollWidth - container.clientWidth) {
           scrollPos = 0;
        }
        
        container.scrollLeft = scrollPos;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => { isHovering = true; };
    const handleMouseLeave = () => { 
        isHovering = false; 
        // Sync our tracker with actual scroll position in case user scrolled manually
        scrollPos = container.scrollLeft;
    };
    
    // Touch support
    const handleTouchStart = () => { isHovering = true; };
    const handleTouchEnd = () => { 
        isHovering = false;
        scrollPos = container.scrollLeft;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section id="collections" className="py-32 bg-obsidian overflow-hidden">
      <div className="px-6 md:px-12 mb-16 flex justify-between items-end">
        <h2 className="font-serif text-4xl md:text-6xl text-gold tracking-widest">
          Signature Collection
        </h2>
        <div className="hidden md:block w-48 h-[1px] bg-warm-grey relative overflow-hidden">
            <motion.div 
                style={{ scaleX: scrollXProgress, transformOrigin: "0%" }}
                className="absolute inset-0 bg-gold"
            />
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-8 overflow-x-auto px-6 md:px-12 pb-12 no-scrollbar"
        style={{ scrollBehavior: "auto" }} // Disable smooth scroll for JS animation to work well
      >
        {/* We duplicate products to allow for a longer scroll before reset, 
            or ideally we implement a true infinite slider. 
            For this quick implementation, doubling the list helps the "loop" feel. */}
        {[...products, ...products].map((product, index) => (
          <Link key={`${product.id}-${index}`} href={`/product/${product.slug}`} className="block group flex-shrink-0">
            <motion.div
              className="min-w-[300px] md:min-w-[400px] h-[500px] md:h-[600px] relative border border-gold/30 overflow-hidden transition-all duration-500 hover:border-gold hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)] bg-obsidian"
            >
              {/* Product Image */}
              {getProductImage(product) && (
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    className="object-cover opacity-60 grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              )}

              {/* Background with accent color gradient - Using Gold for brand consistency */}
              <div 
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 mix-blend-soft-light"
                style={{ 
                    background: `linear-gradient(135deg, var(--color-gold), transparent)` 
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                <span className="inline-block px-3 py-1 mb-4 border border-gold text-gold text-[10px] uppercase tracking-widest">
                  {product.category}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-cream mb-2 group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-cream/70 text-sm line-clamp-2 mb-4 font-light">
                  {product.tagline}
                </p>
                <div className="flex gap-2 text-[10px] text-gold/80 tracking-widest uppercase">
                    {product.notes.slice(0, 3).join(" · ")}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

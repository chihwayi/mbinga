"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  order_index: number;
  is_active: boolean;
}

interface Props {
  slides?: HeroSlide[];
}

export default function Hero({ slides = [] }: Props) {
  const activeSlides = slides.filter(s => s.is_active);
  const hasSlides = activeSlides.length > 0;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (!hasSlides) {
    // Default hero: the two signature bottles fill the screen as a split
    // full-bleed background (left half Gafa Intense, right half Goldess),
    // with the statement overlaid on top — replacing the old logo-only
    // version that left a large empty gap before the scroll prompt.
    return (
      <section
        className="relative h-screen flex flex-col justify-center items-center overflow-hidden"
        role="banner"
        aria-label="MBINGA Luxury Fragrances - Born in the Heart of Africa"
      >
        {/* Split background */}
        <div className="absolute inset-0 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative w-1/2 h-full"
          >
            <Image
              src="/images/gafa-intense.png"
              alt="MBINGA Gafa Intense"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-obsidian/55" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            className="relative w-1/2 h-full"
          >
            <Image
              src="/images/goldess.png"
              alt="MBINGA Goldess"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-obsidian/55" />
          </motion.div>
        </div>

        {/* Center seam */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/30 z-[1]" />

        {/* Vignette for extra text legibility at the center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.3)_0%,_transparent_60%)] z-[1]" />

        <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-4xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="relative w-[120px] h-[42px] md:w-[160px] md:h-[56px] mb-6 md:mb-8"
            style={{ filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))" }}
          >
            <Image src="/images/logo.svg" alt="MBINGA" fill className="object-contain" priority />
          </motion.div>

          {/* Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-center flex flex-col items-center gap-3 md:gap-4"
          >
            <h1 className="font-cinzel font-bold text-3xl sm:text-4xl md:text-6xl text-cream leading-tight tracking-wide drop-shadow-lg">
              Presence. Power. Influence.
            </h1>
            <p className="font-montserrat font-extrabold text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase text-gold drop-shadow">
              Born in the Heart of Africa
            </p>
            <p className="text-cream/70 text-sm md:text-base font-light max-w-lg mt-1 drop-shadow">
              Crafted to make a statement. A luxury fragrance house defined by quiet authority.
            </p>

            <Link
              href="/#collection"
              className="mt-5 md:mt-7 px-10 py-4 bg-obsidian/80 backdrop-blur-sm border border-gold text-gold font-bold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300 text-sm"
            >
              Discover Your Scent
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-gold text-xs tracking-widest uppercase z-10 drop-shadow"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll to Explore ↓
        </motion.div>
      </section>
    );
  }

  const slide = activeSlides[current];

  return (
    <section
      className="relative h-screen flex flex-col justify-center items-center overflow-hidden"
      role="banner"
      aria-label="MBINGA Luxury Fragrances"
    >
      {/* Slide backgrounds */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image_url}
            alt={slide.title || "Hero slide"}
            fill
            className="object-cover"
            priority
          />
          {/* A light bottom-only fade keeps the image clear and visible while
              still giving the title/subtitle text enough contrast. */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-gold)_0%,_transparent_70%)] opacity-5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
        <motion.div
          className="relative w-[180px] h-[64px] md:w-[280px] md:h-[100px] mb-10"
          style={{ filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))" }}
        >
          <Image src="/images/logo.svg" alt="MBINGA" fill className="object-contain" priority />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "-text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            {slide.title && (
              <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-white leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
            )}
            {slide.subtitle && (
              <p className="text-white/80 text-base md:text-lg font-light tracking-wide max-w-xl drop-shadow">
                {slide.subtitle}
              </p>
            )}
            {slide.cta_text && slide.cta_link && (
              <Link
                href={slide.cta_link}
                className="mt-4 px-10 py-4 bg-obsidian border border-gold text-gold font-bold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300 text-sm"
              >
                {slide.cta_text}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-gold w-6" : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold text-xs tracking-widest uppercase"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to Explore ↓
      </motion.div>
    </section>
  );
}

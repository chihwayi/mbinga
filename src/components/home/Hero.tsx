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
    // Fallback: original logo-only hero
    return (
      <section
        className="relative h-screen flex flex-col justify-center items-center overflow-hidden"
        role="banner"
        aria-label="MBINGA Luxury Fragrances - Born in the Heart of Africa"
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-gold)_0%,_var(--color-obsidian)_70%)] opacity-10"
          animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-[280px] h-[100px] md:w-[600px] md:h-[200px] mb-8"
            style={{ filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))" }}
          >
            <Image src="/images/logo.svg" alt="MBINGA" fill className="object-contain" priority />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="font-serif text-lg md:text-xl font-light tracking-widest uppercase text-gold/70"
            role="heading"
            aria-level={2}
          >
            BORN IN THE HEART OF AFRICA
          </motion.p>
        </div>
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gold text-xs tracking-widest uppercase"
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
          {/* Overlay */}
          <div className="absolute inset-0 bg-obsidian/60" />
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
              <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight">
                {slide.title}
              </h1>
            )}
            {slide.subtitle && (
              <p className="text-white/60 text-base md:text-lg font-light tracking-wide max-w-xl">
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

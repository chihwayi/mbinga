"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Gradient Pulse */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-amethyst)_0%,_var(--color-obsidian)_70%)] opacity-30"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-serif text-6xl md:text-9xl font-light tracking-[0.2em] mb-4 bg-gradient-to-br from-cream to-gold bg-clip-text text-transparent"
        >
          MBINGA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-lg md:text-xl tracking-[0.3em] uppercase text-cream/80"
        >
          Born from the Heart of Africa
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gold text-xs tracking-widest uppercase"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Scroll to Explore ↓
      </motion.div>
    </section>
  );
}

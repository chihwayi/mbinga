"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Subtle Gold Glow Behind Logo */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-gold)_0%,_var(--color-obsidian)_70%)] opacity-10"
        animate={{
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-[280px] h-[100px] md:w-[600px] md:h-[200px] mb-8"
          style={{
            filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))"
          }}
        >
          <Image
            src="/images/logo.svg"
            alt="MBINGA"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-lg md:text-xl tracking-[0.3em] uppercase text-gold/70"
        >
          BORN IN THE HEART OF AFRICA
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

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Story() {
  return (
    <section id="our-story" className="py-32 px-6 bg-warm-grey relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl text-gold mb-8 leading-tight">
            A Legacy in <br /> Every Bottle
          </h2>
          <p className="text-cream/80 text-lg leading-relaxed mb-10 font-light">
            In Shona culture, Mbinga speaks of strength, resilience, and a position earned through vision and action. Our fragrances embody this spirit, weaving together rare ingredients from across the continent to create scents that command respect and leave a lasting impression.
          </p>
          
          <Link href="/about" className="inline-block px-8 py-4 bg-obsidian border border-gold text-gold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300">
            Discover Our Story
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] border border-gold/30 bg-gradient-to-br from-warm-grey to-obsidian overflow-hidden group"
        >
            <Image 
                src="/images/african-soul.png" 
                alt="Crafted with African Soul"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* CSS Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent opacity-20 pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
}

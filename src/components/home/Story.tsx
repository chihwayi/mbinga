"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
            Crafted with <br /> African Soul
          </h2>
          <p className="text-cream/80 text-lg leading-relaxed mb-6 font-light">
            MBINGA is more than fragrance—it is identity expressed through scent. Born from the rich cultural tapestry of Zimbabwe and elevated through the art of niche perfumery, each creation tells a story of heritage, power, and refined elegance.
          </p>
          <p className="text-cream/80 text-lg leading-relaxed mb-10 font-light">
            Our master perfumers source rare ingredients from across the continent, weaving them into compositions that honor our roots while defining modern luxury. From the woody depths of Ngwéré Oud to the vibrant energy of Uzoba Lit, every fragrance is an invitation to discover your olfactory signature.
          </p>
          
          <Link href="/about" className="inline-block px-8 py-4 border border-gold text-gold uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300">
            Discover Our Heritage
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] border border-gold/30 bg-gradient-to-br from-warm-grey to-obsidian overflow-hidden group"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-6xl text-gold/10 text-center tracking-widest group-hover:scale-110 transition-transform duration-1000">
                    CRAFTED <br/> IN <br/> AFRICA
                </span>
            </div>
            {/* CSS Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent opacity-20"></div>
        </motion.div>
      </div>
    </section>
  );
}

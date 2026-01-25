"use client";

import { motion } from "framer-motion";

const essenceItems = [
  {
    emoji: "👑",
    title: "Authority",
    description:
      "Each fragrance commands presence without announcement. Refined power expressed through scent, designed for those who understand that true dominance is quiet, intentional, and unforgettable.",
  },
  {
    emoji: "🌍",
    title: "Heritage",
    description:
      "Rooted in African depth and elevated through modern perfumery. We honor our origins while crafting scents that transcend borders, blending tradition with contemporary artistry.",
  },
  {
    emoji: "✨",
    title: "Artistry",
    description:
      "Master perfumers source exceptional ingredients to create olfactory experiences that resonate with timeless elegance. Every bottle is a testament to rare craftsmanship and personal expression.",
  },
];

export default function BrandEssence() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-obsidian to-warm-grey">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-center mb-16 text-gold tracking-widest"
        >
          The MBINGA Philosophy
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {essenceItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group p-10 bg-amethyst/5 border border-gold/20 hover:bg-amethyst/10 hover:border-gold hover:-translate-y-2 transition-all duration-500 text-center"
            >
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                {item.emoji}
              </div>
              <h3 className="font-serif text-2xl mb-4 text-cream">{item.title}</h3>
              <p className="text-cream/70 leading-relaxed font-light">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

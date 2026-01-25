"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const articles = [
  {
    id: 1,
    title: "The Art of Layering Scents",
    category: "Rituals",
    date: "Oct 24, 2025",
    image: "/images/journal-1.jpg", // Placeholder
  },
  {
    id: 2,
    title: "Sourcing Oud from the Source",
    category: "Ingredients",
    date: "Nov 12, 2025",
    image: "/images/journal-2.jpg", // Placeholder
  },
  {
    id: 3,
    title: "Defining Presence",
    category: "Lifestyle",
    date: "Dec 05, 2025",
    image: "/images/journal-3.jpg", // Placeholder
  },
];

export default function Journal() {
  return (
    <section id="journal" className="py-24 px-8 bg-obsidian border-t border-gold/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
            The Journal
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6">
            Reflections on Luxury
          </h2>
          <div className="h-[1px] w-24 bg-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 mb-6 overflow-hidden bg-white/5">
                {/* Placeholder for image */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center text-white/10 font-serif text-4xl group-hover:scale-110 transition-transform duration-700">
                  {article.category[0]}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs tracking-widest text-gold/60">
                  <span className="uppercase">{article.category}</span>
                  <span className="w-1 h-1 bg-gold/60 rounded-full" />
                  <span>{article.date}</span>
                </div>
                <h3 className="font-serif text-2xl text-cream group-hover:text-gold transition-colors">
                  {article.title}
                </h3>
                <span className="inline-block text-xs uppercase tracking-widest text-white/40 border-b border-transparent group-hover:border-gold group-hover:text-gold transition-all mt-4">
                  Read Article
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

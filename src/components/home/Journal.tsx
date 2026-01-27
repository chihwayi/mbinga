"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const articles = [
  {
    id: 1,
    title: "The Art of Layering Scents",
    category: "Rituals",
    date: "Oct 24, 2025",
    image: "/images/african-soul.png",
  },
  {
    id: 2,
    title: "Sourcing Oud from the Source",
    category: "Ingredients",
    date: "Nov 12, 2025",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Defining Presence",
    category: "Lifestyle",
    date: "Dec 05, 2025",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
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
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-6">
                    <div className="text-white/10 font-serif text-6xl absolute -top-12 -right-4 opacity-20">
                        {article.category[0]}
                    </div>
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

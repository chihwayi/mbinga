"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductFilm from "./ProductFilm";

const films = [
  { name: "Gafa Intense", poster: "/images/gafa-intense.png", video: "/videos/gafa-intense.mp4" },
  { name: "DNA Oud",      poster: "/images/dna-oud.png",      video: "/videos/dna-oud.mp4" },
  { name: "Goridhé",      poster: "/images/goridhe.png",      video: "/videos/goridhe.mp4" },
  { name: "Goldess",      poster: "/images/goldess.png",      video: "/videos/goldess.mp4" },
];

export default function Films() {
  const [openFilm, setOpenFilm] = useState<string | null>(null);

  return (
    <section className="py-32 px-6 bg-obsidian">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-montserrat font-extrabold text-3xl md:text-5xl text-gold tracking-wide">
            MBINGA in Motion
          </h2>
          <p className="text-cream/60 mt-4 font-light max-w-xl mx-auto">
            Four signature scents, brought to life. Tap a film to watch.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {films.map((film, i) => (
            <motion.div
              key={film.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductFilm
                name={film.name}
                poster={film.poster}
                video={film.video}
                isOpen={openFilm === film.name}
                onOpen={() => setOpenFilm(film.name)}
                onClose={() => setOpenFilm(null)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

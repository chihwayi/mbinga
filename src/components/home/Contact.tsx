"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-8 bg-gradient-to-b from-obsidian to-black border-t border-gold/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
            Contact Us
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-8">
            Begin Your Journey
          </h2>
          <p className="text-cream/70 font-light text-lg leading-relaxed mb-12 max-w-md">
            Whether you seek a consultation for your signature scent or wish to learn more about our heritage, we are here to guide you.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-obsidian transition-all duration-300">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gold mb-1">Email</h4>
                <a href="mailto:concierge@mbinga.com" className="text-xl font-serif text-cream hover:text-gold transition-colors">
                  concierge@mbinga.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-obsidian transition-all duration-300">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gold mb-1">WhatsApp</h4>
                <a href="https://wa.me/263770000000" className="text-xl font-serif text-cream hover:text-gold transition-colors">
                  +263 77 000 0000
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 bg-white/5 p-8 md:p-12 border border-white/10"
        >
          <h3 className="font-serif text-2xl text-gold mb-8">Newsletter</h3>
          <p className="text-cream/60 mb-8 font-light">
            Subscribe to receive exclusive invitations to private viewings and new collection launches.
          </p>
          
          <form className="space-y-6">
            <div>
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-white/20 py-4 text-cream placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <button className="w-full py-4 bg-obsidian text-gold border border-gold uppercase tracking-widest font-semibold hover:bg-gold hover:text-obsidian transition-colors duration-300">
              Subscribe
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-center gap-8">
            <a href="#" className="text-gold/60 hover:text-gold transition-colors">
                <Instagram size={24} />
            </a>
            <a href="#" className="text-gold/60 hover:text-gold transition-colors">
                <Facebook size={24} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

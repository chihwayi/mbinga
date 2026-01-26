"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { toggleCart, getItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const menuItems = ["Collections", "Our Story", "Journal", "Contact"];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full px-8 py-6 flex justify-between items-center z-50 bg-gradient-to-b from-obsidian/95 to-transparent backdrop-blur-[2px]"
      >
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-gold hover:text-gold-light transition-colors"
        >
          <Menu size={24} />
        </button>

        <Link href="/" className="relative h-12 w-32 hover:opacity-80 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="MBINGA"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <ul className="hidden md:flex gap-12 list-none">
          {menuItems.map((item) => (
            <li key={item}>
              <Link
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-cream text-sm uppercase tracking-widest relative group hover:text-gold transition-colors"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={toggleCart}
          className="text-gold hover:text-gold-light transition-transform hover:scale-110 relative"
        >
          <ShoppingBag size={24} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-obsidian text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-obsidian flex flex-col items-center justify-center md:hidden"
          >
            <button
              onClick={toggleMobileMenu}
              className="absolute top-6 left-8 text-gold hover:text-gold-light transition-colors"
            >
              <X size={24} />
            </button>

            <ul className="flex flex-col gap-8 text-center">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl text-gold hover:text-white transition-colors tracking-widest"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

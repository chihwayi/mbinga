"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Play, X } from "lucide-react";

interface Props {
  name: string;
  poster: string;
  video: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Shows a poster image with a play button. The actual video only loads once
// a visitor presses play, and playback opens in a centered lightbox over the
// whole site rather than staying inline in the grid tile.
export default function ProductFilm({ name, poster, video, isOpen, onOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="group relative aspect-[3/4] w-full overflow-hidden border border-gold/20 bg-black block"
        aria-label={`Play ${name} film`}
      >
        <Image
          src={poster}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
            <Play className="w-6 h-6 md:w-7 md:h-7 text-gold group-hover:text-obsidian fill-current ml-1" />
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
          <p className="font-serif text-xl md:text-2xl text-cream">{name}</p>
          <p className="text-gold text-xs uppercase tracking-widest mt-1">Watch the Film</p>
        </div>
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 md:top-8 md:right-8 w-11 h-11 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-obsidian transition-colors z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-video bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={video}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

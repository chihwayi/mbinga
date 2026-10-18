"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface Props {
  name: string;
  poster: string;
  video: string;
}

// Shows a poster image with a play button; the actual video file is only
// requested once the visitor clicks play, so it never adds weight to the
// initial page load.
export default function ProductFilm({ name, poster, video }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group relative aspect-[3/4] overflow-hidden border border-gold/20 bg-black">
      {isPlaying ? (
        <video
          src={video}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 w-full h-full"
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
      )}
    </div>
  );
}

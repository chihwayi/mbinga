"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

// Browsers block unmuted autoplay until the user has interacted with the
// page, so we try to play immediately and, if that's rejected, start on the
// visitor's first click/tap/keypress instead.
export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isAdminRoute) return;

    audio.volume = 0.5;

    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();

    const startOnInteraction = () => {
      tryPlay();
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };
    window.addEventListener("click", startOnInteraction);
    window.addEventListener("touchstart", startOnInteraction);
    window.addEventListener("keydown", startOnInteraction);

    return () => {
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };
  }, [isAdminRoute]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  if (isAdminRoute) return null;

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/ambient.aac" type="audio/aac" />
        <source src="/audio/ambient.mp3" type="audio/mpeg" />
      </audio>
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-black/60 border border-gold/30 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-black/80 transition-colors"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </>
  );
}

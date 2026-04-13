"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, GripVertical, X } from "lucide-react";
import { uploadImage } from "@/actions/upload";
import { AnimatePresence, motion } from "framer-motion";

interface HeroSlide {
  id:          string;
  title:       string;
  subtitle:    string;
  image_url:   string;
  cta_text:    string;
  cta_link:    string;
  order_index: number;
  is_active:   boolean;
}

interface Props {
  initialSlides: HeroSlide[];
}

export default function HeroSlidesManager({ initialSlides }: Props) {
  const [slides, setSlides]       = useState<HeroSlide[]>(initialSlides);
  const [isAdding, setIsAdding]   = useState(false);
  const [loading, setLoading]     = useState<string | null>(null);

  const [newSlide, setNewSlide]   = useState({
    title:    "",
    subtitle: "",
    cta_text: "Explore Collection",
    cta_link: "/#collection",
  });
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploading, setUploading]     = useState(false);

  // ─── Upload image ─────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImage(formData);
    if (result.success && result.url) {
      setUploadedUrl(result.url);
    } else {
      alert(result.error || "Upload failed");
    }
    setUploading(false);
  };

  // ─── Save new slide ───────────────────────────────────────────────────────
  const handleSaveSlide = async () => {
    if (!uploadedUrl) { alert("Please upload an image first."); return; }
    setLoading("saving");

    const res = await fetch("/api/admin/hero-slides", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newSlide,
        image_url:   uploadedUrl,
        order_index: slides.length,
        is_active:   true,
      }),
    });

    if (res.ok) {
      const { slide } = await res.json();
      setSlides(prev => [...prev, slide]);
      setIsAdding(false);
      setNewSlide({ title: "", subtitle: "", cta_text: "Explore Collection", cta_link: "/#collection" });
      setUploadedUrl("");
    } else {
      alert("Failed to save slide.");
    }
    setLoading(null);
  };

  // ─── Toggle active ────────────────────────────────────────────────────────
  const toggleActive = async (id: string, currentValue: boolean) => {
    setLoading(id);
    await fetch(`/api/admin/hero-slides/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !currentValue }),
    });
    setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentValue } : s));
    setLoading(null);
  };

  // ─── Delete slide ─────────────────────────────────────────────────────────
  const deleteSlide = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    setLoading(id);
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    setSlides(prev => prev.filter(s => s.id !== id));
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Slides List */}
      <div className="space-y-4">
        {slides.length === 0 && !isAdding && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-white/40">
            No slides yet. Add your first hero slide below.
          </div>
        )}

        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`bg-white/5 border rounded-xl overflow-hidden flex items-center gap-4 p-4 transition-colors ${
              slide.is_active ? "border-gold/30" : "border-white/10 opacity-50"
            }`}
          >
            <GripVertical size={18} className="text-white/20 flex-shrink-0 cursor-grab" />

            <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
              <Image src={slide.image_url} alt={slide.title || `Slide ${idx + 1}`} fill className="object-cover" />
            </div>

            <div className="flex-grow min-w-0">
              <p className="text-white font-medium truncate">{slide.title || <span className="text-white/30 italic">No title</span>}</p>
              <p className="text-white/40 text-sm truncate">{slide.subtitle || <span className="italic">No subtitle</span>}</p>
              <p className="text-gold/60 text-xs mt-1">{slide.cta_text} → {slide.cta_link}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                slide.is_active ? "bg-emerald-400/10 text-emerald-400" : "bg-white/10 text-white/40"
              }`}>
                {slide.is_active ? "Active" : "Hidden"}
              </span>

              <button
                onClick={() => toggleActive(slide.id, slide.is_active)}
                disabled={loading === slide.id}
                className="p-2 text-white/40 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
                title={slide.is_active ? "Hide slide" : "Show slide"}
              >
                {slide.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              <button
                onClick={() => deleteSlide(slide.id)}
                disabled={loading === slide.id}
                className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Slide Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-gold/30 rounded-xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gold font-serif text-xl">New Hero Slide</h3>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs uppercase tracking-widest text-white/40">Hero Image *</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full bg-black/40 border border-dashed border-white/20 rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
                      {uploading ? (
                        <p className="text-white/40 text-sm">Uploading...</p>
                      ) : uploadedUrl ? (
                        <div className="relative h-32">
                          <Image src={uploadedUrl} alt="Preview" fill className="object-cover rounded-lg" />
                        </div>
                      ) : (
                        <p className="text-white/40 text-sm">Click to upload image</p>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Title</label>
                <input
                  type="text"
                  value={newSlide.title}
                  onChange={e => setNewSlide(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                  placeholder="e.g. Born in the Heart of Africa"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Subtitle</label>
                <input
                  type="text"
                  value={newSlide.subtitle}
                  onChange={e => setNewSlide(p => ({ ...p, subtitle: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                  placeholder="e.g. Luxury fragrances crafted with African heritage"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Button Text</label>
                <input
                  type="text"
                  value={newSlide.cta_text}
                  onChange={e => setNewSlide(p => ({ ...p, cta_text: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                  placeholder="e.g. Explore Collection"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Button Link</label>
                <input
                  type="text"
                  value={newSlide.cta_link}
                  onChange={e => setNewSlide(p => ({ ...p, cta_link: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none"
                  placeholder="e.g. /#collection"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSlide}
                  disabled={loading === "saving" || uploading || !uploadedUrl}
                  className="px-8 py-3 bg-obsidian border border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-obsidian transition-colors disabled:opacity-50"
                >
                  {loading === "saving" ? "Saving..." : "Save Slide"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl py-6 text-white/40 hover:text-gold hover:border-gold/50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add New Slide
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { createProduct, updateProduct } from "@/actions/products";
import { uploadImage } from "@/actions/upload";
import { Save, Upload } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-obsidian border border-gold text-gold px-8 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gold hover:text-obsidian transition-colors disabled:opacity-50"
    >
      <Save size={18} />
      {pending ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
    </button>
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const isEditing = !!product;
  const [imageUrl, setImageUrl] = useState(product?.image || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);
    if (result.success && result.url) {
      setImageUrl(result.url);
    } else {
      alert("Failed to upload image");
    }
    setIsUploading(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (isEditing && product) {
      await updateProduct(product.id, formData);
    } else {
      await createProduct(formData);
    }
  };

  return (
    <form action={handleSubmit} className="max-w-4xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-gold border-b border-white/10 pb-2">Basic Info</h3>
          
          <div>
            <label className="block text-white/60 text-sm mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              defaultValue={product?.name}
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Slug (URL)</label>
            <input
              type="text"
              name="slug"
              defaultValue={product?.slug}
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Tagline</label>
            <input
              type="text"
              name="tagline"
              defaultValue={product?.tagline}
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-white/60 text-sm mb-2">Price ($)</label>
                <input
                type="number"
                name="price"
                step="0.01"
                defaultValue={product?.price}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                />
            </div>
            <div>
                <label className="block text-white/60 text-sm mb-2">Stock</label>
                <input
                type="number"
                name="stock"
                defaultValue={product?.stock}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Category</label>
            <select
              name="category"
              defaultValue={product?.category || "Unisex"}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
            >
              <option value="Unisex">Unisex</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-gold border-b border-white/10 pb-2">Details</h3>

          <div>
            <label className="block text-white/60 text-sm mb-2">Description</label>
            <textarea
              name="description"
              defaultValue={product?.description}
              required
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Story</label>
            <textarea
              name="story"
              defaultValue={product?.story}
              required
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-serif text-gold border-b border-white/10 pb-2">Composition & Visuals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-white/60 text-sm mb-2">Notes (comma separated)</label>
                <input
                type="text"
                name="notes"
                defaultValue={product?.notes}
                placeholder="Agarwood, Rose, Amber"
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                />
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">Ingredients (comma separated)</label>
                <input
                type="text"
                name="ingredients"
                defaultValue={product?.ingredients}
                placeholder="Alcohol Denat, Parfum, Water"
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                />
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">Product Image</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... or /uploads/..."
                      required
                      className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                    />
                    <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg px-4 py-3 flex items-center gap-2 transition-colors">
                      <Upload size={18} />
                      <span className="hidden md:inline">{isUploading ? "Uploading..." : "Upload"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="relative w-full h-48 bg-black/20 rounded-lg overflow-hidden border border-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  )}
                </div>
            </div>

            <div>
                <label className="block text-white/60 text-sm mb-2">Accent Color (Hex)</label>
                <div className="flex gap-2">
                    <input
                    type="color"
                    name="accentColor"
                    defaultValue={product?.accentColor || "#D4AF37"}
                    className="h-[50px] w-[50px] bg-transparent border-none cursor-pointer"
                    />
                    <input
                    type="text"
                    name="accentColor"
                    defaultValue={product?.accentColor || "#D4AF37"}
                    required
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
        <Link 
            href="/admin/products"
            className="px-8 py-3 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
            Cancel
        </Link>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}

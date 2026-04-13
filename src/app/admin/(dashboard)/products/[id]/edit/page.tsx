import { getProductById } from "@/actions/products";
import ProductForm from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  // ProductForm expects notes/ingredients as comma-separated strings for the textarea
  const formProduct = {
    ...product,
    notes:       Array.isArray(product.notes) ? product.notes.join(", ") : product.notes,
    ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(", ") : product.ingredients,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
            href="/admin/products"
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-colors"
        >
            <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Edit Product</h2>
          <p className="text-white/40 font-light">Update product details.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8">
        <ProductForm product={formProduct} />
      </div>
    </div>
  );
}

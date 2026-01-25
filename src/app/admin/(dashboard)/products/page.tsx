import prisma from "@/lib/db";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "@/actions/products";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Products</h2>
          <p className="text-white/40 font-light">Manage your perfume collection.</p>
        </div>
        <Link 
            href="/admin/products/new"
            className="bg-gold text-obsidian px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white/60 focus:outline-none">
                <option>All Categories</option>
                <option>Signature</option>
                <option>Private Blend</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/5 text-white/40 uppercase tracking-widest text-[10px]">
                <th className="p-6 font-medium">Product</th>
                <th className="p-6 font-medium">Category</th>
                <th className="p-6 font-medium">Price</th>
                <th className="p-6 font-medium">Stock</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                            {product.image ? (
                                <Image src={product.image} alt={product.name} width={48} height={48} className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-xs text-black/20 font-serif">Img</span>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-white text-lg font-serif">{product.name}</p>
                            <p className="text-white/40 text-xs truncate max-w-[200px]">{product.tagline}</p>
                        </div>
                    </div>
                  </td>
                  <td className="p-6 text-white/60">
                    <span className="px-2 py-1 rounded border border-white/10 text-xs uppercase tracking-wider">
                        {product.category}
                    </span>
                  </td>
                  <td className="p-6 text-gold font-serif text-lg">${product.price}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-400' : 'bg-red-500'}`} />
                        <span className="text-white/60">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-white/60 hover:text-gold hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Edit2 size={16} />
                        </Link>
                        <form action={deleteProduct.bind(null, product.id)}>
                            <button type="submit" className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

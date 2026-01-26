"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, ChevronDown, Check, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrders, createOrder, updateOrderStatus, deleteOrder } from "@/actions/orders";

type Order = {
  id: string;
  customer: string;
  email?: string;
  phone: string;
  address?: string;
  items: string;
  amount: number;
  status: string;
  date: Date;
};

export default function AdminOrders() {
  const [isRecording, setIsRecording] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const result = await getOrders();
    if (result.success && result.orders) {
      setOrders(result.orders as Order[]);
    }
    setIsLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newOrder = {
      customer: formData.get("customer") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      items: formData.get("items") as string,
      amount: parseFloat(formData.get("amount") as string),
    };

    const result = await createOrder(newOrder);
    if (result.success) {
      setIsRecording(false);
      loadOrders();
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateOrderStatus(id, newStatus);
    loadOrders();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
        await deleteOrder(id);
        loadOrders();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Orders</h2>
          <p className="text-white/40 font-light">Track and record orders from WhatsApp.</p>
        </div>
        <button 
            onClick={() => setIsRecording(true)}
            className="bg-gold text-obsidian px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={18} />
          Record Order
        </button>
      </div>

      {/* Manual Order Entry Form Modal (Inline for now) */}
      <AnimatePresence>
        {isRecording && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 border border-gold/30 rounded-xl p-6 overflow-hidden"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gold font-serif text-xl">Record New Order</h3>
                    <button onClick={() => setIsRecording(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Customer Name</label>
                        <input name="customer" required type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Phone Number</label>
                        <input name="phone" required type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="e.g. +263 77..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Email Address</label>
                        <input name="email" type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="e.g. email@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Delivery Address</label>
                        <input name="address" type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="e.g. 123 Main St, Harare" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Order Details (Items)</label>
                        <textarea name="items" required className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none h-24" placeholder="Paste order details from WhatsApp..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Total Amount ($)</label>
                        <input name="amount" required type="number" step="0.01" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Status</label>
                        <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white/50">
                            Pending (Default)
                        </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => setIsRecording(false)} className="px-6 py-3 text-white/60 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="px-8 py-3 bg-obsidian border border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-obsidian transition-colors">Save Order</button>
                    </div>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/5 text-white/40 uppercase tracking-widest text-[10px]">
                <th className="p-6 font-medium">Order ID</th>
                <th className="p-6 font-medium">Customer</th>
                <th className="p-6 font-medium">Items</th>
                <th className="p-6 font-medium">Total</th>
                <th className="p-6 font-medium">Status</th>
                <th className="p-6 font-medium">Date</th>
                <th className="p-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                  <tr>
                      <td colSpan={7} className="p-6 text-center text-white/40">Loading orders...</td>
                  </tr>
              ) : orders.length === 0 ? (
                  <tr>
                      <td colSpan={7} className="p-6 text-center text-white/40">No orders found.</td>
                  </tr>
              ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-6 font-medium text-white">{order.id}</td>
                      <td className="p-6">
                        <div className="text-white/80">{order.customer}</div>
                        <div className="text-white/40 text-xs">{order.phone}</div>
                        {order.email && <div className="text-white/40 text-xs">{order.email}</div>}
                        {order.address && <div className="text-white/30 text-[10px] mt-1 truncate max-w-[150px]" title={order.address}>{order.address}</div>}
                      </td>
                      <td className="p-6 text-white/60 max-w-xs truncate" title={order.items}>{order.items}</td>
                      <td className="p-6 text-gold font-medium">${order.amount}</td>
                      <td className="p-6">
                        <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`bg-transparent border-none outline-none cursor-pointer text-xs font-medium uppercase tracking-wide ${
                                order.status === 'Paid' ? 'text-emerald-400' :
                                order.status === 'Pending' ? 'text-amber-400' :
                                'text-blue-400'
                            }`}
                        >
                            <option value="Pending" className="bg-obsidian text-amber-400">Pending</option>
                            <option value="Paid" className="bg-obsidian text-emerald-400">Paid</option>
                            <option value="Shipped" className="bg-obsidian text-blue-400">Shipped</option>
                        </select>
                      </td>
                      <td className="p-6 text-white/40">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="p-6">
                        <button 
                            onClick={() => handleDelete(order.id)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

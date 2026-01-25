"use client";

import { useState } from "react";
import { Plus, Search, Filter, ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrders() {
  const [isRecording, setIsRecording] = useState(false);

  // Mock Orders
  const [orders, setOrders] = useState([
    { id: "ORD-001", customer: "Farai Munetsi", phone: "+263 77 123 4567", items: "Mbinga Noir", amount: 120, status: "Pending", date: "2025-10-24" },
    { id: "ORD-002", customer: "Sarah Johnson", phone: "+263 71 987 6543", items: "Golden Savanna (x2)", amount: 290, status: "Paid", date: "2025-10-24" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding order
    const newOrder = {
        id: `ORD-00${orders.length + 1}`,
        customer: "New Customer",
        phone: "+263...",
        items: "Pending Items",
        amount: 0,
        status: "Pending",
        date: new Date().toISOString().split('T')[0]
    };
    setOrders([newOrder, ...orders]);
    setIsRecording(false);
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
                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Phone Number</label>
                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="e.g. +263 77..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Order Details (Items)</label>
                        <textarea className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none h-24" placeholder="Paste order details from WhatsApp..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Total Amount ($)</label>
                        <input type="number" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Status</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold/50 outline-none">
                            <option>Pending Payment</option>
                            <option>Paid</option>
                            <option>Shipped</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => setIsRecording(false)} className="px-6 py-3 text-white/60 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="px-8 py-3 bg-gold text-obsidian font-bold rounded-lg hover:bg-white transition-colors">Save Order</button>
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
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-medium text-white">{order.id}</td>
                  <td className="p-6">
                    <div className="text-white">{order.customer}</div>
                    <div className="text-white/40 text-xs">{order.phone}</div>
                  </td>
                  <td className="p-6 text-white/60">{order.items}</td>
                  <td className="p-6 text-gold font-serif">${order.amount}</td>
                  <td className="p-6">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide font-medium ${
                        order.status === 'Paid' ? 'bg-emerald-400/10 text-emerald-400' :
                        order.status === 'Pending' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-blue-400/10 text-blue-400'
                    }`}>
                        {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-white/40">{order.date}</td>
                  <td className="p-6 text-right">
                    <button className="text-gold hover:text-white text-xs uppercase tracking-wider font-medium">Edit</button>
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

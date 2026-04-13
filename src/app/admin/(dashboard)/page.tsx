import { supabase } from "@/lib/supabase";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const [{ count: productCount }, { data: orders }, { data: lowStock }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("id,name,category,stock").lte("stock", 5).order("stock", { ascending: true }).limit(5),
  ])

  const allOrders = orders ?? []
  const totalRevenue     = allOrders.reduce((acc, o) => acc + Number(o.total_amount ?? o.amount ?? 0), 0)
  const activeOrdersCount = allOrders.filter(o => o.status === 'Pending' || o.status === 'pending' || o.status === 'paid').length

  const stats = [
    { label: "Total Revenue",  value: `$${totalRevenue.toLocaleString()}`, change: "+12%", icon: DollarSign },
    { label: "Active Orders",  value: activeOrdersCount.toString(),         change: "+2",   icon: ShoppingCart },
    { label: "Total Products", value: (productCount ?? 0).toString(),       change: "0",    icon: Package },
    { label: "Monthly Growth", value: "24%",                                change: "+4%",  icon: TrendingUp },
  ]

  const recentOrders = allOrders.slice(0, 5).map(o => ({
    id:       o.id as string,
    customer: (o.customer_name ?? o.customer) as string,
    items:    typeof o.items === "string" ? o.items : JSON.stringify(o.items),
    total:    `$${Number(o.total_amount ?? o.amount ?? 0)}`,
    status:   o.status as string,
    date:     new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  }))

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
            <h2 className="text-3xl font-serif text-white mb-2">Dashboard</h2>
            <p className="text-white/40 font-light">Welcome back, Administrator.</p>
        </div>
        <div className="text-right">
            <p className="text-gold text-sm tracking-widest uppercase">Today&apos;s Date</p>
            <p className="text-white/60 font-serif text-xl">{today}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-gold/30 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-obsidian transition-all">
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-serif text-white mb-1">{stat.value}</h3>
            <p className="text-white/40 text-sm tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-serif text-xl text-white">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs text-gold hover:text-white uppercase tracking-widest transition-colors">View All</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/5 text-white/40 uppercase tracking-widest text-[10px]">
                    <th className="p-6 font-medium">Order ID</th>
                    <th className="p-6 font-medium">Customer</th>
                    <th className="p-6 font-medium">Total</th>
                    <th className="p-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-6 font-medium text-white font-mono text-xs">{order.id.slice(0, 8)}…</td>
                      <td className="p-6 text-white/80">
                        <div>{order.customer}</div>
                        <div className="text-xs text-white/40 truncate max-w-[150px]">{order.items}</div>
                      </td>
                      <td className="p-6 text-gold">{order.total}</td>
                      <td className="p-6">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide font-medium ${
                          order.status === 'paid'    || order.status === 'Paid'    ? 'bg-emerald-400/10 text-emerald-400' :
                          order.status === 'pending' || order.status === 'Pending' ? 'bg-amber-400/10 text-amber-400' :
                          'bg-blue-400/10 text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-white/40 text-sm">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-fit">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif text-xl text-white">Low Stock Alerts</h3>
            </div>
            <div className="divide-y divide-white/5">
                {(lowStock ?? []).length === 0 ? (
                    <div className="p-8 text-center text-white/40 text-sm">
                        All stock levels are healthy.
                    </div>
                ) : (
                    (lowStock ?? []).map(product => (
                        <div key={product.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <h4 className="font-medium text-white mb-1">{product.name}</h4>
                                <p className="text-xs text-white/40 uppercase tracking-wider">{product.category}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xl font-serif ${product.stock === 0 ? 'text-red-500' : 'text-amber-400'}`}>
                                    {product.stock}
                                </span>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest">Left</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

import { logout } from "@/actions/auth";

export default function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <aside className="w-64 bg-obsidian border-r border-white/10 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 border-b border-white/10">
        <Link href="/" className="block">
          <h1 className="font-serif text-2xl text-gold tracking-[0.2em] hover:text-white transition-colors">
            MBINGA
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-white/40">Admin Portal</span>
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive
                  ? "bg-gold text-obsidian font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={18} className={clsx(isActive ? "text-obsidian" : "text-gold/70 group-hover:text-gold")} />
              <span className="tracking-wide text-sm">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-8 bg-gold rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <form action={logout}>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300">
            <LogOut size={18} />
            <span className="tracking-wide text-sm">Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

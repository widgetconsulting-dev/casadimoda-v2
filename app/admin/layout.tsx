"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  Gift,
  Ticket,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Brands", href: "/admin/brands", icon: Tag },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Gift Cards", href: "/admin/giftcards", icon: Gift },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white flex flex-col fixed h-screen shadow-2xl z-50">
        <div className="p-8 border-b border-white/5">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-white font-black text-xl italic font-playfair">
                C
              </span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase font-playfair">
              Casa Admin<span className="text-accent ml-0.5">.</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-6 space-y-2 mt-4 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-4">
            Management
          </p>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                  isActive
                    ? "bg-accent text-primary shadow-lg shadow-accent/20"
                    : "hover:bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span
                    className={`text-sm tracking-wide ${
                      isActive ? "font-black" : "font-medium"
                    }`}
                  >
                    {link.name}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight size={14} className="animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-4 px-4 py-4 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold text-sm cursor-pointer"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-72 p-10">{children}</main>
    </div>
  );
}

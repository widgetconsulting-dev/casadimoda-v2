"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

interface NavbarProps {
  onOpenSidebar: () => void;
}

export default function Navbar({ onOpenSidebar }: NavbarProps) {
  return (
    <div className="bg-primary/95 border-t border-white/10 px-4 py-1 flex items-center gap-4 text-sm font-medium">
      <div
        onClick={onOpenSidebar}
        className="flex items-center gap-1 p-1 px-2 border border-transparent hover:border-accent rounded-sm cursor-pointer font-bold text-secondary group transition-all"
      >
        <Menu className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
        All
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
        {[
          "High Jewelry",
          "Luxury Watches",
          "Latest Collection",
          "Designer Bags",
          "Exclusive Home",
        ].map((item) => (
          <Link
            key={item}
            href={`/category/${item.toLowerCase().replace(/ /g, "-")}`}
            className="p-1 px-2 border border-transparent hover:border-accent rounded-sm transition-all text-secondary/90 hover:text-white"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}

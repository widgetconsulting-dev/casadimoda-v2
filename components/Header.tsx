"use client";

import { useState } from "react";
import TopBar from "./header/TopBar";
import Navbar from "./header/Navbar";
import Sidebar from "./header/Sidebar";

interface HeaderProps {
  categories: string[];
  brands: string[];
  categoryMap: Record<string, string[]>;
}

export default function Header({
  categories,
  brands,
  categoryMap,
}: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="flex flex-col text-white font-sans ring-1 ring-white/5 shadow-lg relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        brands={brands}
        categoryMap={categoryMap}
      />
      <TopBar />
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
    </header>
  );
}

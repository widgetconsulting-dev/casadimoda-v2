"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/utils/context/Store";
import Logo from "@/components/Logo";
import { useSession, signOut } from "next-auth/react";
import { MapPin, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import Image from "next/image";

export default function TopBar() {
  const { state } = useStore();
  const { cart } = state;
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [bump, setBump] = useState(false);

  const cartQuantity = cart.cartItems.reduce(
    (a: number, c: { quantity: number }) => a + c.quantity,
    0
  );

  useEffect(() => {
    if (cartQuantity === 0) return;
    setBump(true);
    const timer = setTimeout(() => {
      setBump(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [cartQuantity]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&pageSize=5`);
          const data = await res.json();
          setSearchResults(data.products || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search fetch error", error);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-primary px-4 py-2 flex items-center gap-4 relative z-50 flex-wrap">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center p-2 border border-transparent hover:border-accent rounded-sm group transition-all"
      >
        <Logo />
      </Link>

      {/* Deliver to */}
      <div className="hidden lg:flex flex-col items-start p-2 border border-transparent  rounded-sm cursor-pointer leading-tight group">
        <span className="text-xs text-secondary opacity-70">Deliver to</span>
        <div className="flex items-center gap-1 font-bold text-sm text-secondary">
          <MapPin className="w-4 h-4 text-accent" />
          Tunisia
        </div>
      </div>

      {/* Search Bar */}
      <div ref={dropdownRef} className="flex-grow relative group z-50">
        <div className="flex h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-accent">
          <div className="bg-secondary text-text-dark px-3 flex items-center gap-1 text-xs border-r border-gray-200 cursor-pointer hover:bg-gray-200 font-medium whitespace-nowrap">
            All <ChevronDown className="w-3 h-3" />
          </div>
          <input
            type="text"
            className="flex-grow px-3 text-primary text-sm outline-none placeholder:text-gray-400"
            placeholder="Search our exclusive collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery.length > 1 && searchResults.length > 0) setShowDropdown(true); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-accent hover:opacity-90 px-5 flex items-center justify-center cursor-pointer transition-all text-primary"
          >
            <Search className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Live Search Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]">
            <ul className="divide-y divide-gray-50">
              {searchResults.map((product) => (
                <li key={product._id}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-all duration-200 group/item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 group-hover/item:border-accent/30 transition-colors">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold text-primary truncate group-hover/item:text-accent transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-text-dark/50 uppercase tracking-wider group-hover/item:text-text-dark/70">
                        {product.brand}
                      </p>
                    </div>
                    <div className="text-xs font-black text-accent whitespace-nowrap group-hover/item:scale-105 transition-transform">
                      ${(product.discountPrice || product.price).toLocaleString()}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSearchSubmit}
              className="w-full p-2 bg-secondary text-[10px] font-black uppercase tracking-widest text-primary hover:bg-accent hover:text-white transition-colors"
            >
              View All Results
            </button>
          </div>
        )}
      </div>

      {/* Language Selection */}
      <div className="hidden md:flex items-center gap-1 p-2 border border-transparent hover:border-accent rounded-sm cursor-pointer font-bold text-sm text-secondary">
        🇫🇷 EN <ChevronDown className="w-2.5 h-2.5 mt-0.5 opacity-60" />
      </div>

      {/* Accounts & Lists */}
      <div className="relative group p-2 border border-transparent hover:border-accent rounded-sm cursor-pointer leading-tight">
        {session?.user ? (
          <>
            <span className="text-xs text-secondary opacity-70 font-normal">
              Hello, {session.user.name}
            </span>
            <div className="flex items-center gap-1 font-bold text-sm text-secondary whitespace-nowrap">
              Account & Lists{" "}
              <ChevronDown className="w-2.5 h-2.5 mt-0.5 opacity-60" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 w-56 mt-0 bg-white shadow-2xl rounded-b-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border border-gray-100 cursor-default">
              <div className="p-4 border-b border-gray-50 bg-secondary/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 mb-1">
                  Authenticated As
                </p>
                <p className="text-sm font-bold text-primary truncate">
                  {session.user.isAdmin
                    ? "Luxe Administrator"
                    : "Privileged Member"}
                </p>
              </div>
              <div className="flex flex-col py-2">
                {session.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-3 text-xs font-bold text-primary hover:bg-accent hover:text-white transition-colors flex items-center justify-between"
                  >
                    Admin Dashboard
                    <span className="bg-primary/5 px-2 py-0.5 rounded text-[8px] uppercase">
                      Staff Only
                    </span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="px-4 py-3 text-xs font-bold text-primary hover:bg-accent hover:text-white transition-colors"
                >
                  Member Profile
                </Link>
                <Link
                  href="/orders"
                  className="px-4 py-3 text-xs font-bold text-primary hover:bg-accent hover:text-white transition-colors"
                >
                  Order History
                </Link>
                <div className="h-[1px] bg-gray-50 my-2 mx-4" />
                <button
                  onClick={() => signOut()}
                  className="mx-4 cursor-pointer mb-2 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-accent hover:text-primary transition-all active:scale-95 shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link href="/login">
            <span className="text-xs text-secondary opacity-70 font-normal">
              Hello, sign in
            </span>
            <div className="flex items-center gap-1 font-bold text-sm text-secondary whitespace-nowrap">
              Account & Lists{" "}
              <ChevronDown className="w-2.5 h-2.5 mt-0.5 opacity-60" />
            </div>
          </Link>
        )}
      </div>

      {/* Returns & Orders */}
      <div className="hidden sm:flex flex-col items-start p-2 border border-transparent hover:border-accent rounded-sm cursor-pointer leading-tight">
        <span className="text-xs text-secondary opacity-70 font-normal">
          Returns
        </span>
        <div className="font-bold text-sm text-secondary">& Orders</div>
      </div>

      {/* Cart */}
      <Link
        href="/cart"
        className="flex items-end p-2 border border-transparent hover:border-accent rounded-sm group"
      >
        <div className="relative">
          <ShoppingCart
            className="w-8 h-8 text-white group-hover:text-accent transition-colors"
            strokeWidth={1.5}
          />
          <span
            className={`absolute top-[-2px] right-[5px] text-primary text-[10px] font-black px-0.5 rounded-full leading-none min-w-[18px] min-h-[18px] flex items-center justify-center transition-transform duration-300 ${bump ? "scale-150 bg-yellow-400" : "scale-100 bg-accent"
              }`}
          >
            {cartQuantity}
          </span>
        </div>
        <span className="font-bold text-sm mb-1 hidden lg:inline ml-1 text-secondary">
          Basket
        </span>
      </Link>
    </div>
  );
}

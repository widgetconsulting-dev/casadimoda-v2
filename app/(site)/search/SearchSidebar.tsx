"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

interface SearchSidebarProps {
  categories: string[];
  brands: string[];
  category: string;
  brand: string;
  price: string;
  rating: string;
  sort: string;
}

export default function SearchSidebar({
  categories,
  brands,
  category,
  brand,
  price,
  rating,
  sort,
}: SearchSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to push new params
  const filterSearch = ({
    category,
    brand,
    price,
    rating,
    sort,
  }: {
    category?: string;
    brand?: string;
    price?: string;
    rating?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (price) params.set("price", price);
    if (rating) params.set("rating", rating);
    if (sort) params.set("sort", sort);

    // Reset page on filter change
    params.set("page", "1");

    router.push(`/search?${params.toString()}`);
  };

  const prices = [
    { name: "$1 to $50", value: "1-50" },
    { name: "$51 to $200", value: "51-200" },
    { name: "$201 to $1000", value: "201-1000" },
  ];

  const ratings = [4, 3, 2, 1];

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">
          Collections
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => filterSearch({ category: "all" })}
              className={`text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                category === "all" ? "text-accent" : "text-text-dark/60"
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() => filterSearch({ category: c })}
                className={`text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                  category === c ? "text-accent" : "text-text-dark/60"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* filter by Brand */}
      <div>
        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">
          Brands
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => filterSearch({ brand: "all" })}
              className={`text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                brand === "all" ? "text-accent" : "text-text-dark/60"
              }`}
            >
              All Brands
            </button>
          </li>
          {brands.map((b) => (
            <li key={b}>
              <button
                onClick={() => filterSearch({ brand: b })}
                className={`text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                  brand === b ? "text-accent" : "text-text-dark/60"
                }`}
              >
                {b}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">
          Price Range
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => filterSearch({ price: "all" })}
              className={`text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                price === "all" ? "text-accent" : "text-text-dark/60"
              }`}
            >
              Any Price
            </button>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <button
                onClick={() => filterSearch({ price: p.value })}
                className={`text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                  price === p.value ? "text-accent" : "text-text-dark/60"
                }`}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Ratings */}
      <div>
        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">
          Rating
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => filterSearch({ rating: "all" })}
              className={`text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                rating === "all" ? "text-accent" : "text-text-dark/60"
              }`}
            >
              Any Rating
            </button>
          </li>
          {ratings.map((r) => (
            <li key={r}>
              <button
                onClick={() => filterSearch({ rating: r.toString() })}
                className={`flex items-center gap-2 text-xs font-bold transition-colors text-left w-full hover:text-accent ${
                  rating === r.toString() ? "text-accent" : "text-text-dark/60"
                }`}
              >
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < r ? "currentColor" : "none"}
                      strokeWidth={i < r ? 0 : 2}
                      className={i < r ? "" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

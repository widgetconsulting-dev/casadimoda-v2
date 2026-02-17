"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SortSelectProps {
  currentSort: string;
}

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "featured", label: "Featured" },
  { value: "lowest", label: "Price: Low to High" },
  { value: "highest", label: "Price: High to Low" },
  { value: "toprated", label: "Top Rated" },
];

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption =
    sortOptions.find((opt) => opt.value === currentSort) || sortOptions[0];

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove sort parameter
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    // Reset to first page when sorting changes
    params.delete("page");

    // Navigate to the new URL
    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);

    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-bold text-text-dark/70">Sort by:</span>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-secondary px-4 py-2  text-xs font-bold text-primary border-none outline-none cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 min-w-[180px] justify-between"
        >
          {currentOption.label}
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 w-full mt-1 bg-white  shadow-2xl border border-gray-100 overflow-hidden z-[100]">
            <ul className="divide-y divide-gray-50">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <button
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left cursor-pointer px-4 py-3 text-xs font-bold transition-all duration-200 ${
                      currentSort === option.value
                        ? "bg-accent text-white"
                        : "text-primary hover:bg-gray-50 hover:text-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

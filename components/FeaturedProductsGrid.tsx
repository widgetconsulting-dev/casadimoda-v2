"use client";

import { useState } from "react";
import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";

interface FeaturedProductsGridProps {
  products: Product[];
  pageSize?: number;
}

export default function FeaturedProductsGrid({
  products,
  pageSize = 8,
}: FeaturedProductsGridProps) {
  const [visible, setVisible] = useState(pageSize);

  const visibleProducts = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 mb-8">
        {visibleProducts.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setVisible((prev) => prev + pageSize)}
            className="bg-primary hover:bg-accent text-white hover:text-primary px-10 py-3 rounded-full transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] shadow-md hover:shadow-accent/40 active:scale-95 cursor-pointer"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}

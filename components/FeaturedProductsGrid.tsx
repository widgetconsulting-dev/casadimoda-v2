"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("products");
  const [visible, setVisible] = useState(pageSize);

  const visibleProducts = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 mb-8">
        {visibleProducts.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setVisible((prev) => prev + pageSize)}
            className="border border-white/20 hover:border-accent text-white/60 hover:text-accent px-10 py-3 transition-all duration-300 text-[9px] font-bold uppercase tracking-[0.25em] cursor-pointer"
          >
            {t("seeMore")}
          </button>
        </div>
      )}
    </>
  );
}

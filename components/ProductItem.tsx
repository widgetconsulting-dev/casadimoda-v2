"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/utils/context/Store";
import { Product, Supplier } from "@/types";
import { Heart } from "lucide-react";

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  const { state, dispatch } = useStore();

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find(
      (x) => x.slug === product.slug,
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        discountPrice: product.discountPrice,
        countInStock: product.countInStock,
        quantity,
      },
    });
  };

  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;

  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="group relative bg-[#1a1a1a]/90 border border-white/[0.08] overflow-hidden flex flex-col">
      {/* Top bar: logo + heart */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 sm:px-4 sm:pt-4">
        <span className="font-serif text-[9px] sm:text-[11px] text-accent/60 tracking-widest uppercase">
          Casa di Moda
        </span>
        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/30 hover:text-accent cursor-pointer transition-colors" />
      </div>

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-[#222]"
      >
        {/* Badge */}
        {product.isFeatured && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-accent/90 text-[6px] sm:text-[8px] font-bold uppercase tracking-widest text-white px-2 py-0.5 sm:px-2.5 sm:py-1">
            Nouveauté
          </span>
        )}
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-contain p-4 sm:p-6 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 20vw"
          unoptimized={true}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const fallbacks: Record<string, string> = {
              Jackets: "1551006917-0624bb7c3cfd",
              Accessories: "1523275335684-37898b6baf30",
              Shoes: "1549298916-b41d501d3772",
              Pants: "1541099649105-f69ad21f3246",
              Home: "1513519245088-0e12902e5a38",
              Electronics: "1498050108023-c5249f4df085",
              Shirts: "1523381235312-3c1a403824ae",
            };
            const photoId =
              fallbacks[product.category as string] ||
              "1515886657613-9f3515b0c78f";
            target.src = `https://images.unsplash.com/photo-${photoId}?q=80&w=1020&auto=format&fit=crop`;
          }}
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center px-3 py-3 sm:px-4 sm:py-4 flex-grow">
        <Link href={`/product/${product.slug}`} className="flex-grow w-full">
          <h3 className="text-white font-bold uppercase tracking-wider text-[9px] sm:text-xs leading-tight line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-white/30 uppercase tracking-wider text-[7px] sm:text-[10px] mb-2">
            {product.brand}
          </p>
          <div className="mb-2 sm:mb-3">
            {hasDiscount ? (
              <div className="flex items-center justify-center gap-2">
                <span
                  suppressHydrationWarning
                  className="text-white font-bold text-sm sm:text-lg"
                >
                  {displayPrice.toLocaleString("en-US")}
                </span>
                <span className="text-white/30 text-[9px] sm:text-xs">TND</span>
                <span
                  suppressHydrationWarning
                  className="text-white/25 line-through text-[9px] sm:text-xs"
                >
                  {product.price.toLocaleString("en-US")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5">
                <span
                  suppressHydrationWarning
                  className="text-white font-bold text-sm sm:text-lg"
                >
                  {displayPrice.toLocaleString("en-US")}
                </span>
                <span className="text-white/30 text-[9px] sm:text-xs">TND</span>
              </div>
            )}
          </div>
        </Link>

        {/* Add to Cart */}
        <button
          onClick={addToCartHandler}
          className="w-full border border-white/20 hover:border-accent hover:bg-accent/10 text-white/80 hover:text-accent py-1.5 sm:py-2 text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
        >
          Ajouter au Panier
        </button>
      </div>
    </div>
  );
}

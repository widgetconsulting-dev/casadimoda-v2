"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/utils/context/Store";
import { Product, Supplier } from "@/types";
import { Star } from "lucide-react";

interface ProductItemProps {
  product: Product;
}

function RatingStars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-[8px] sm:text-[10px] text-blue-600">
        ({count.toLocaleString()})
      </span>
    </div>
  );
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

  const imageBlock = (
    <div className="relative aspect-[4/3] sm:aspect-square w-full bg-gray-50">
      <Image
        src={product.image || "/images/placeholder.jpg"}
        alt={product.name}
        fill
        className="object-contain p-2 sm:object-cover sm:p-0 transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 40vw, (max-width: 1200px) 33vw, 25vw"
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
    </div>
  );

  const infoBlock = (
    <div>
      <p className="text-primary font-medium text-[10px] sm:text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors duration-300">
        {product.name}
      </p>

      <p className="text-[7px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1 bg-gray-100 inline-block px-1 sm:px-1.5 py-px sm:py-0.5 rounded">
        {product.subCategory || product.category}
      </p>

      {product.rating > 0 && (
        <div className="mt-1">
          <RatingStars rating={product.rating} count={product.numReviews} />
        </div>
      )}

      <div className="mt-1 sm:mt-2">
        {hasDiscount ? (
          <>
            <span
              suppressHydrationWarning
              className="text-sm sm:text-xl font-bold text-primary"
            >
              ${product.discountPrice.toLocaleString("en-US")}
            </span>
            <span
              suppressHydrationWarning
              className="text-[8px] sm:text-xs text-gray-400 line-through ml-1"
            >
              ${product.price.toLocaleString("en-US")}
            </span>
          </>
        ) : (
          <span
            suppressHydrationWarning
            className="text-sm sm:text-xl font-bold text-primary"
          >
            ${product.price.toLocaleString("en-US")}
          </span>
        )}
      </div>

      {product.deliveryTime && (
        <p className="text-[7px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1">
          Delivery:{" "}
          <span className="font-semibold text-primary">
            {product.deliveryTime}
          </span>
        </p>
      )}

      {product.supplier && typeof product.supplier === "object" && (
        <p className="hidden sm:block text-[10px] text-gray-400 mt-1">
          by{" "}
          <Link
            href={`/supplier/${(product.supplier as Supplier).businessSlug}`}
            className="font-bold text-accent/80 hover:text-accent hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {(product.supplier as Supplier).businessName}
          </Link>
        </p>
      )}
    </div>
  );

  return (
    <div className="group border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
      {/* Mobile: horizontal layout */}
      <div className="flex sm:hidden">
        <Link
          href={`/product/${product.slug}`}
          className="w-[100px] flex-shrink-0"
        >
          {imageBlock}
        </Link>
        <div className="flex flex-col flex-grow p-2 min-w-0">
          <Link href={`/product/${product.slug}`} className="flex-grow">
            {infoBlock}
          </Link>
          <button
            onClick={addToCartHandler}
            className="mt-1.5 w-full bg-accent hover:bg-amber-400 text-primary py-1 rounded-full text-[8px] font-bold shadow-sm active:scale-95 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Desktop: vertical card layout */}
      <div className="hidden sm:flex sm:flex-col">
        <Link href={`/product/${product.slug}`} className="flex-grow">
          {imageBlock}
          <div className="p-4">{infoBlock}</div>
        </Link>
        <div className="p-4 pt-0 mt-auto">
          <button
            onClick={addToCartHandler}
            className="w-full bg-accent hover:bg-amber-400 text-primary py-2.5 rounded-full transition-all duration-300 text-xs font-bold shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

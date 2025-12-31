"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/utils/context/Store";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";

import { Product } from "@/types";

interface ProductDetailsContentProps {
  product: Product;
}

export default function ProductDetailsContent({
  product,
}: ProductDetailsContentProps) {
  const { state, dispatch } = useStore();
  const [qty, setQty] = useState(1);

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + qty : qty;

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
        countInStock: product.countInStock,
        quantity,
      },
    });
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAdjusting = useCallback(
    (direction: "up" | "down") => {
      const adjust = () => {
        setQty((prev) => {
          if (direction === "up") {
            return Math.min(product.countInStock, prev + 1);
          } else {
            return Math.max(1, prev - 1);
          }
        });
      };

      adjust(); // Initial adjustment

      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(adjust, 100); // Speed up after 500ms
      }, 500);
    },
    [product.countInStock]
  );

  const stopAdjusting = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => stopAdjusting();
  }, [stopAdjusting]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex text-[10px] text-text-dark/40 mb-10 uppercase tracking-[0.2em] gap-3 items-center">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="text-[8px]">▶</span>
        <span className="hover:text-accent cursor-pointer transition-colors">
          {product.category}
        </span>
        <span className="text-[8px]">▶</span>
        <span className="text-primary font-bold tracking-normal">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Image Column */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-secondary border border-gray-100 group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <p className="text-accent font-black uppercase text-[11px] tracking-[0.4em] bg-accent/5 px-3 py-1 rounded-full">
                {product.subCategory}
              </p>
              <div className="h-px flex-grow bg-gray-100" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-4 leading-none lowercase">
              {product.name}
              <span className="text-accent">.</span>
            </h1>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent text-lg leading-none">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-text-dark/40 font-medium tracking-wide">
                from {product.numReviews} exclusive reviews
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-5xl font-black text-primary leading-none">
              ${product.price}
            </span>
            <span className="text-sm text-text-dark/40 uppercase tracking-widest font-bold">
              Inc. VAT
            </span>
          </div>

          <div className="mb-10 space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                Curated Description
              </h3>
              <p className="text-lg text-text-dark/70 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-2xl p-5 border border-gray-100 hover:border-accent/30 transition-colors">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-text-dark/40 mb-3 text-center">
                  Specifications
                </h4>
                <ul className="space-y-2 text-[11px] font-medium">
                  <li className="flex justify-between border-b border-gray-100/50 pb-1">
                    <span className="text-text-dark/40">Size</span>
                    <span className="text-primary">{product.dimensions}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100/50 pb-1">
                    <span className="text-text-dark/40">Weight</span>
                    <span className="text-primary">{product.weight}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-text-dark/40">Volume</span>
                    <span className="text-primary">{product.cbm} m³</span>
                  </li>
                </ul>
              </div>
              <div className="bg-primary rounded-2xl p-6 text-white flex flex-col justify-center items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                  Status
                </span>
                <p className="text-xl font-black tracking-tight">
                  {product.countInStock > 0 ? "Available" : "Sold Out"}
                </p>
                <span className="text-[9px] font-bold">
                  {product.countInStock} Units Left
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4 bg-white border-2 border-primary rounded-2xl px-6 py-4 flex-1">
              <span className="text-[10px] font-black text-text-dark/40 uppercase tracking-widest whitespace-nowrap">
                Quantity
              </span>
              <div className="flex items-center justify-between flex-grow">
                <button
                  type="button"
                  onMouseDown={() => startAdjusting("down")}
                  onMouseUp={stopAdjusting}
                  onMouseLeave={stopAdjusting}
                  onTouchStart={() => startAdjusting("down")}
                  onTouchEnd={stopAdjusting}
                  className="p-1 hover:text-accent transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={qty <= 1}
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <span className="text-lg font-black text-primary w-8 text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onMouseDown={() => startAdjusting("up")}
                  onMouseUp={stopAdjusting}
                  onMouseLeave={stopAdjusting}
                  onTouchStart={() => startAdjusting("up")}
                  onTouchEnd={stopAdjusting}
                  className="p-1 hover:text-accent transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={qty >= product.countInStock}
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQty(Math.min(product.countInStock, qty + 10))
                  }
                  className="ml-1 text-[11px] font-black text-accent hover:text-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed bg-accent/10 px-2 py-0.5 rounded-md"
                  disabled={qty >= product.countInStock}
                >
                  +10
                </button>
              </div>
            </div>
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-accent hover:scale-[1.02] active:scale-95 text-primary font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-accent/20 text-sm uppercase tracking-[0.2em] flex-1 cursor-pointer disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Reserve Item
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-dark/30">
            <p className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent opacity-100" />
              Ready in{" "}
              <span className="text-primary">{product.deliveryTime}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useStore } from "@/utils/context/Store";
import { Product } from "@/types";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

const COLOR_MAP: Record<string, string> = {
  Noir: "#111111",
  Blanc: "#f5f5f5",
  "Blanc Total": "#f5f5f5",
  "Blanc / Gris": "#e5e7eb",
  "Blanc / Bleu": "#dbeafe",
  Rouge: "#dc2626",
  "Rouge Bordeaux": "#881337",
  "Rouge Carmin": "#9f1239",
  "Noir / Rouge": "#1f2937",
  Gris: "#9ca3af",
  "Gris Chiné": "#d1d5db",
  "Gris / Jaune": "#9ca3af",
  Bleu: "#2563eb",
  "Bleu Nuit": "#1e3a5f",
  Marine: "#1e3a5f",
  Marron: "#78350f",
  "Marron Cognac": "#8b4513",
  Vert: "#16a34a",
  "Vert Émeraude": "#059669",
  Or: "#c9a96e",
  "Or & Ivoire": "#c9a96e",
  Argent: "#c0c0c0",
  "Noir / Argent": "#2d2d2d",
  Fauve: "#c8860a",
  Étoupe: "#9e9082",
};

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const { state, dispatch } = useStore();

  const firstColor = product.colors?.[0] ?? null;
  const firstImage = firstColor
    ? (product.colorImages?.find((ci) => ci.color === firstColor)?.image ??
      product.image)
    : product.image;

  const [activeImage, setActiveImage] = useState(firstImage);
  const [activeColor, setActiveColor] = useState<string | null>(firstColor);

  const handleColorClick = (color: string) => {
    setActiveColor(color);
    const match = product.colorImages?.find((ci) => ci.color === color);
    setActiveImage(match?.image ?? product.image);
  };

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert(tc("outOfStock"));
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        name: product.name,
        slug: product.slug,
        image: activeImage,
        price: product.price,
        discountPrice: product.discountPrice,
        countInStock: product.countInStock,
        quantity,
        selectedColor: activeColor ?? undefined,
      },
    });
  };

  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;

  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div
      className="
        group relative flex flex-col overflow-hidden
        bg-gradient-to-b from-[#1c1c1c] to-[#141414]
        border border-white/[0.06]
        shadow-lg
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Star className="w-4 h-4 text-white/25 hover:text-accent cursor-pointer transition" />

        <span className="font-serif text-[10px] tracking-[0.25em] text-accent/70 uppercase">
          {tc("brand")}
        </span>

        <Heart className="w-4 h-4 text-white/25 hover:text-accent cursor-pointer transition" />
      </div>

      {/* Gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square bg-[#202020] overflow-hidden"
      >
        {product.isFeatured && (
          <span className="absolute top-3 left-3 z-10 bg-accent px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow">
            {t("newBadge")}
          </span>
        )}

        <Image
          src={activeImage || "/images/placeholder.jpg"}
          alt={activeColor ? `${product.name} — ${activeColor}` : product.name}
          fill
          unoptimized
          className="object-contain p-8 transition-all duration-500 group-hover:scale-110 group-hover:opacity-95"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow px-4 py-4 text-center">
        <Link href={`/product/${product.slug}`} className="flex-grow">
          {/* Title */}
          <h3 className="text-white font-semibold text-sm tracking-wide line-clamp-2 mb-1">
            {product.name}
          </h3>

          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
            {product.brand}
          </p>

          {/* Price */}
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold text-white">
                  {displayPrice.toLocaleString("en-US")}
                </span>
                <span className="text-xs text-white/40">{tc("currency")}</span>
                <span className="text-xs line-through text-white/25">
                  {product.price.toLocaleString("en-US")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl font-bold text-white">
                  {displayPrice.toLocaleString("en-US")}
                </span>
                <span className="text-xs text-white/40">{tc("currency")}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex justify-center gap-2 mb-2 flex-wrap">
            {product.colors.slice(0, 5).map((color) => {
              const hex = COLOR_MAP[color] || "#888";
              const isActive = activeColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => handleColorClick(color)}
                  className={`
                   cursor-pointer h-5 w-5 rounded-full border transition-all duration-200 shadow-inner
                    ${
                      isActive
                        ? "border-accent scale-125 ring-2 ring-accent/40"
                        : "border-white/15 hover:border-white/40 hover:scale-110"
                    }
                  `}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>
        )}

        {/* Active color label */}
        {activeColor && (
          <p className="text-[10px] text-accent/70 uppercase tracking-widest mb-2">
            {activeColor}
          </p>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="px-2 py-1 text-[10px] bg-white/5 rounded-md border border-white/10 text-white/50 font-semibold"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={addToCartHandler}
          className="cursor-pointer w-full bg-accent text-white py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02]"
        >
          {t("addToCart")}
        </button>
      </div>
    </div>
  );
}

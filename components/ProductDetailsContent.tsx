"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useStore } from "@/utils/context/Store";
import { ChevronLeft, ChevronRight, Truck, RotateCcw, Heart } from "lucide-react";

import { Product } from "@/types";

interface ProductDetailsContentProps {
  product: Product;
}

// Map French color names to CSS hex values for swatches
const COLOR_MAP: Record<string, string> = {
  "Noir": "#111111",
  "Blanc": "#f5f5f5",
  "Blanc Total": "#f5f5f5",
  "Blanc / Gris": "#e5e7eb",
  "Blanc / Bleu": "#dbeafe",
  "Rouge": "#dc2626",
  "Rouge Bordeaux": "#881337",
  "Rouge Carmin": "#9f1239",
  "Noir / Rouge": "#1f2937",
  "Gris": "#9ca3af",
  "Gris Chiné": "#d1d5db",
  "Gris / Jaune": "#e5e4c2",
  "Bleu": "#2563eb",
  "Bleu Nuit": "#1e3a5f",
  "Vert": "#16a34a",
  "Vert Émeraude": "#059669",
  "Or": "#c9a96e",
  "Or & Ivoire": "#ddc49a",
  "Marine": "#1e3a5f",
  "Fauve": "#a0522d",
  "Étoupe": "#9e8e7e",
  "Marron": "#78350f",
  "Marron Cognac": "#92400e",
  "Argent": "#c0c0c0",
  "Noir / Argent": "#2d2d2d",
};

export default function ProductDetailsContent({
  product,
}: ProductDetailsContentProps) {
  const { data: session } = useSession();
  const { state, dispatch } = useStore();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectionError, setSelectionError] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(product.image);

  // Check wishlist status on mount
  useEffect(() => {
    if (!session || !product._id) return;
    fetch(`/api/wishlist?productId=${product._id}`)
      .then((r) => r.json())
      .then((data) => setIsWishlisted(data.isWishlisted))
      .catch(() => {});
  }, [session, product._id]);

  const toggleWishlist = async () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }
    setWishlistLoading(true);
    try {
      const method = isWishlisted ? "DELETE" : "POST";
      const res = await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      setIsWishlisted(data.isWishlisted);
    } catch {
      // ignore
    } finally {
      setWishlistLoading(false);
    }
  };

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;

  const addToCartHandler = () => {
    if (hasSizes && !selectedSize) {
      setSelectionError("Veuillez choisir une taille");
      return;
    }
    if (hasColors && !selectedColor) {
      setSelectionError("Veuillez choisir une couleur");
      return;
    }
    setSelectionError("");

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
        discountPrice: product.discountPrice,
        countInStock: product.countInStock,
        quantity,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined,
      },
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
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

      adjust();

      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(adjust, 100);
      }, 500);
    },
    [product.countInStock],
  );

  const stopAdjusting = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => stopAdjusting();
  }, [stopAdjusting]);

  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-3 md:px-8 py-4 md:py-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap text-[8px] md:text-[10px] text-primary/40 mb-4 md:mb-8 uppercase tracking-[0.15em] gap-1.5 md:gap-2 items-center">
          <Link href="/" className="hover:text-accent transition-colors">
            Accueil
          </Link>
          <span className="text-primary/20">›</span>
          <Link
            href="/products"
            className="hover:text-accent transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-primary/20">›</span>
          <span className="text-primary/60 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Column */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden bg-white border border-gray-100">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-contain p-6 md:p-10"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Info Column */}
          <div className="flex flex-col">
            {/* Title & Brand */}
            <div className="mb-4 md:mb-6">
              <h1 className="text-lg md:text-2xl font-bold text-primary uppercase tracking-wide mb-1">
                {product.name}
              </h1>
              <p className="text-xs md:text-sm text-primary/40 uppercase tracking-wider">
                {product.brand}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-5 md:mb-8">
              {hasDiscount ? (
                <>
                  <span className="text-xl md:text-3xl font-bold text-primary">
                    {displayPrice.toLocaleString("en-US")}
                  </span>
                  <span className="text-sm md:text-base text-primary/40">TND</span>
                  <span className="text-sm text-primary/30 line-through ml-2">
                    {product.price.toLocaleString("en-US")} TND
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl md:text-3xl font-bold text-primary">
                    {displayPrice.toLocaleString("en-US")}
                  </span>
                  <span className="text-sm md:text-base text-primary/40">TND</span>
                </>
              )}
            </div>

            {/* Color Selector */}
            {hasColors && (
              <div className="mb-4 md:mb-5">
                <p className="text-[9px] md:text-[11px] font-bold text-primary/40 uppercase tracking-widest mb-2">
                  Couleur :{" "}
                  {selectedColor && (
                    <span className="text-primary/70 font-bold">{selectedColor}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const hex = COLOR_MAP[color] || "#888";
                    const isLight = ["Blanc", "Blanc Total", "Blanc / Gris", "Gris Chiné"].includes(color);
                    return (
                      <button
                        key={color}
                        title={color}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectionError("");
                          const colorImg = product.colorImages?.find((ci) => ci.color === color);
                          setDisplayImage(colorImg?.image || product.image);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          selectedColor === color
                            ? "border-accent scale-110 shadow-md"
                            : isLight
                            ? "border-gray-300 hover:border-accent"
                            : "border-transparent hover:border-accent"
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {hasSizes && (
              <div className="mb-4 md:mb-5">
                <p className="text-[9px] md:text-[11px] font-bold text-primary/40 uppercase tracking-widest mb-2">
                  Taille :{" "}
                  {selectedSize && (
                    <span className="text-primary/70 font-bold">{selectedSize}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSelectionError(""); }}
                      className={`min-w-[2.25rem] h-9 px-2.5 border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 text-primary hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Error */}
            {selectionError && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 -mt-1">
                ⚠ {selectionError}
              </p>
            )}

            {/* Quantity Selector */}
            <div className="mb-4 md:mb-5">
              <p className="text-[9px] md:text-[11px] font-bold text-primary/40 uppercase tracking-widest mb-2">
                Quantité :
              </p>
              <div className="flex items-center gap-0">
                <button
                  type="button"
                  onMouseDown={() => startAdjusting("down")}
                  onMouseUp={stopAdjusting}
                  onMouseLeave={stopAdjusting}
                  onTouchStart={() => startAdjusting("down")}
                  onTouchEnd={stopAdjusting}
                  className="w-9 h-9 md:w-10 md:h-10 border border-gray-200 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={qty <= 1}
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <span className="w-10 h-9 md:w-12 md:h-10 border-y border-gray-200 flex items-center justify-center text-sm font-bold text-primary">
                  {qty}
                </span>
                <button
                  type="button"
                  onMouseDown={() => startAdjusting("up")}
                  onMouseUp={stopAdjusting}
                  onMouseLeave={stopAdjusting}
                  onTouchStart={() => startAdjusting("up")}
                  onTouchEnd={stopAdjusting}
                  className="w-9 h-9 md:w-10 md:h-10 border border-gray-200 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={qty >= product.countInStock}
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQty(Math.min(product.countInStock, qty + 10))
                  }
                  className="ml-2 text-[9px] md:text-[10px] font-bold text-accent border border-accent/30 px-2.5 py-2 hover:bg-accent hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={qty >= product.countInStock}
                >
                  +10
                </button>
                <span className="ml-3 text-[10px] text-primary/30">
                  {product.countInStock} disponibles
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className={`w-full py-3 md:py-3.5 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all cursor-pointer mb-2 ${
                isAdded
                  ? "bg-green-700 text-white"
                  : "bg-primary text-white hover:bg-accent"
              } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
            >
              {isAdded ? "Ajouté au Panier ✓" : "Ajouter au Panier"}
            </button>

            {/* Wishlist */}
            <button
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className={`w-full py-2.5 md:py-3 border text-[10px] md:text-xs font-medium uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mb-5 md:mb-8 disabled:opacity-50 disabled:cursor-not-allowed ${
                isWishlisted
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-gray-200 hover:border-primary text-primary/60 hover:text-primary"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-accent" : ""}`} />
              {isWishlisted ? "Retiré de la Wishlist" : "Ajouter à la Wishlist"}
            </button>

            {/* Delivery & Returns */}
            <div className="border-t border-gray-200 pt-4 md:pt-6 mb-5 md:mb-8">
              <h3 className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Livraison & Retour
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-primary/40 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] md:text-xs text-primary/60">
                    Livraison rapide — Prêt en{" "}
                    <span className="font-semibold text-primary">
                      {product.deliveryTime || "3-5 jours"}
                    </span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-primary/40 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] md:text-xs text-primary/60">
                    Retour gratuit sous 7 jours
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-4 md:pt-6 mb-5 md:mb-8">
              <h3 className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-[11px] md:text-sm text-primary/60 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Characteristics */}
            {(product.dimensions || product.weight || product.cbm) && (
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  Caractéristiques
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {product.dimensions && (
                    <p className="text-[10px] md:text-xs text-primary/50">
                      • Taille:{" "}
                      <span className="text-primary/80">{product.dimensions}</span>
                    </p>
                  )}
                  {product.weight && (
                    <p className="text-[10px] md:text-xs text-primary/50">
                      • Poids:{" "}
                      <span className="text-primary/80">{product.weight}</span>
                    </p>
                  )}
                  {product.cbm && (
                    <p className="text-[10px] md:text-xs text-primary/50">
                      • Volume:{" "}
                      <span className="text-primary/80">{product.cbm} m³</span>
                    </p>
                  )}
                  <p className="text-[10px] md:text-xs text-primary/50">
                    • Catégorie:{" "}
                    <span className="text-primary/80">{product.subCategory}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

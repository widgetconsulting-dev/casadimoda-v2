"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useStore } from "@/utils/context/Store";
import { CartItem } from "@/types";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const tc = useTranslations("common");
  const { state, dispatch } = useStore();
  const { cart: { cartItems } } = state;

  const [promoCode, setPromoCode] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"delivery" | "card">("delivery");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCartHandler = (item: CartItem, qty: number) => {
    if (item.countInStock < qty) { alert(tc("outOfStock")); return; }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity: qty } });
  };
  const removeItemHandler = (item: CartItem) => dispatch({ type: "CART_REMOVE_ITEM", payload: item });

  const startAdjusting = useCallback((item: CartItem, direction: "up" | "down") => {
    const adjust = () => {
      const newQty = direction === "up" ? item.quantity + 1 : item.quantity - 1;
      if (newQty >= 1 && newQty <= item.countInStock) updateCartHandler(item, newQty);
    };
    adjust();
    timerRef.current = setTimeout(() => { intervalRef.current = setInterval(adjust, 100); }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const stopAdjusting = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);
  useEffect(() => () => stopAdjusting(), [stopAdjusting]);

  const subtotal = cartItems.reduce((a, c) => a + (c.quantity || 0) * (c.discountPrice || c.price || 0), 0);
  const originalTotal = cartItems.reduce((a, c) => a + (c.quantity || 0) * (c.price || 0), 0);
  const totalDiscount = originalTotal - subtotal;

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-[calc(100dvh-var(--header-height,80px))] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('/bgg.webp')" }}
      >
        <div className="w-20 h-20 border border-white/10 bg-white/5 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-accent/40" />
        </div>
        <h1 className="font-serif text-4xl font-bold italic text-white mb-4">Panier Vide</h1>
        <Link href="/" className="bg-accent text-primary px-10 py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-accent/80 transition-all mt-4">
          Explorer la Collection
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100dvh-var(--header-height,80px))] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bgg.webp')" }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">

        {/* Title */}
        <h1 className="font-serif text-5xl md:text-6xl font-bold italic text-white mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT — Items + promo + delivery */}
          <div className="lg:col-span-7 space-y-6">

            {/* Order Summary label */}
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
              Order Summaire
            </p>

            {/* Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.slug} className="bg-black/30 border border-white/10 p-4 flex gap-4">
                  {/* Thumbnail */}
                  <Link href={`/product/${item.slug}`} className="relative w-16 h-20 shrink-0 overflow-hidden bg-white/10">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </Link>
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-black text-white/50 uppercase tracking-widest">{item.name}</p>
                        <p className="text-sm font-black text-white mt-0.5">CASA DI MODA</p>
                        <p className="text-[10px] text-white/30 mt-1">Size M/L</p>
                      </div>
                      <div className="text-right">
                        {item.discountPrice && item.discountPrice < item.price ? (
                          <p className="text-sm font-black text-accent">{item.discountPrice.toLocaleString()} TND</p>
                        ) : (
                          <p className="text-sm font-black text-white">{item.price.toLocaleString()} TND</p>
                        )}
                      </div>
                    </div>
                    {/* Qty + Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/10 bg-white/5">
                        <button onMouseDown={() => startAdjusting(item, "down")} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting} onTouchStart={() => startAdjusting(item, "down")} onTouchEnd={stopAdjusting} disabled={item.quantity <= 1} className="px-3 py-1.5 text-white/60 hover:text-accent disabled:opacity-20 cursor-pointer transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-black text-white min-w-[2rem] text-center">{item.quantity}</span>
                        <button onMouseDown={() => startAdjusting(item, "up")} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting} onTouchStart={() => startAdjusting(item, "up")} onTouchEnd={stopAdjusting} disabled={item.quantity >= item.countInStock} className="px-3 py-1.5 text-white/60 hover:text-accent disabled:opacity-20 cursor-pointer transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItemHandler(item)} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="bg-black/30 border border-white/10 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Code Promo</p>
              <div className="flex gap-3">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code promo"
                  className="flex-1 bg-white/5 border border-white/10 focus:border-accent py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none transition-all"
                />
                <button className="bg-accent hover:bg-accent/80 text-primary font-black px-5 text-[10px] tracking-widest uppercase transition-all cursor-pointer">
                  APPLIQUER
                </button>
              </div>
            </div>

            {/* Livraison Rapide */}
            <div className="bg-black/30 border border-white/10 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Livraison Rapide</p>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={"Rue de Jardin, La Marsa 2040\nTunis, Tunisia"}
                rows={3}
                className="w-full bg-white/5 border border-white/10 focus:border-accent py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* RIGHT — VOIR SUMMAIRE */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 bg-black/50 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">VOIR SUMMAIRE</p>
                <span className="text-white/30 text-lg">›</span>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Soustotal</span>
                  <span className="text-white font-bold">{originalTotal.toLocaleString()} TND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Diamonds</span>
                  <span className={totalDiscount > 0 ? "text-accent font-bold" : "text-white/50"}>
                    {totalDiscount > 0 ? `-${totalDiscount.toLocaleString()} TND` : "Supérieur"}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-5 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-white">{subtotal.toLocaleString()}</span>
                    <span className="text-lg font-bold text-white/40 ml-1">TND</span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setPaymentMethod("delivery")}>
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${paymentMethod === "delivery" ? "border-accent bg-accent" : "border-white/30"}`}>
                    {paymentMethod === "delivery" && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                  </div>
                  <span className={`text-sm font-medium ${paymentMethod === "delivery" ? "text-white" : "text-white/40"}`}>Paiement à la livraison</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setPaymentMethod("card")}>
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${paymentMethod === "card" ? "border-accent bg-accent" : "border-white/30"}`}>
                    {paymentMethod === "card" && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                  </div>
                  <span className={`text-sm font-medium ${paymentMethod === "card" ? "text-white" : "text-white/40"}`}>Saved Card</span>
                </label>
              </div>

              {/* Validate */}
              <button
                onClick={() => alert("Commande validée!")}
                className="w-full bg-accent hover:bg-accent/80 text-primary font-black py-4 uppercase text-xs tracking-[0.3em] transition-all active:scale-[0.98] cursor-pointer shadow-lg"
              >
                VALIDER LA COMMANDE
              </button>

              {/* Payment icons */}
              <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
                {["VISA", "MC", "AMEX", "PAYPAL"].map((b) => (
                  <span key={b} className="text-[9px] font-black text-white/20 border border-white/10 px-2 py-1">{b}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

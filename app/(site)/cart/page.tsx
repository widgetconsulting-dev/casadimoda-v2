"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/utils/context/Store";
import { CartItem } from "@/types";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartScreen() {
  const { state, dispatch } = useStore();
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = (item: CartItem, qty: number) => {
    const quantity = Number(qty);
    if (item.countInStock < quantity) {
      alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const subtotal = cartItems.reduce(
    (a, c) => a + (c.quantity || 0) * (c.discountPrice || c.price || 0),
    0,
  );

  const originalTotal = cartItems.reduce(
    (a, c) => a + (c.quantity || 0) * (c.price || 0),
    0,
  );

  const totalDiscount = originalTotal - subtotal;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAdjusting = useCallback(
    (item: CartItem, direction: "up" | "down") => {
      const adjust = () => {
        const newQty =
          direction === "up" ? item.quantity + 1 : item.quantity - 1;
        if (newQty >= 1 && newQty <= item.countInStock) {
          updateCartHandler(item, newQty);
        }
      };

      adjust(); // Initial adjustment

      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(adjust, 100);
      }, 500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const stopAdjusting = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => stopAdjusting();
  }, [stopAdjusting]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-accent/40" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-primary mb-4 tracking-tight">
          Your basket is empty.
        </h1>
        <p className="text-text-dark/50 mb-8 max-w-sm">
          Discover our latest collection of luxury fashion and high-end
          accessories.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-10 py-4  font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-accent hover:text-primary transition-all active:scale-95"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
          Shopping Basket{" "}
          <span className="text-accent text-2xl ml-2">
            ({cartItems.length})
          </span>
        </h1>
        <div className="h-px flex-grow bg-gray-100 mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {cartItems.map((item) => (
            <div
              key={item.slug}
              className="group bg-white  p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 transition-all hover:shadow-xl hover:border-accent/20"
            >
              {/* Product Image */}
              <Link
                href={`/product/${item.slug}`}
                className="relative w-full sm:w-32 aspect-[3/4]  overflow-hidden bg-secondary"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-xl font-black text-primary hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mt-1">
                      Free Premium Delivery
                    </p>
                  </div>
                  <button
                    onClick={() => removeItemHandler(item)}
                    className="p-2 text-text-dark/20 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                  {/* Quantity Control */}
                  <div className="flex items-center bg-secondary  p-1 gap-1">
                    <button
                      onMouseDown={() => startAdjusting(item, "down")}
                      onMouseUp={stopAdjusting}
                      onMouseLeave={stopAdjusting}
                      onTouchStart={() => startAdjusting(item, "down")}
                      onTouchEnd={stopAdjusting}
                      disabled={item.quantity <= 1}
                      className="p-1 px-3 text-primary disabled:opacity-20 hover:text-accent transition-colors cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-sm font-black text-primary min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onMouseDown={() => startAdjusting(item, "up")}
                      onMouseUp={stopAdjusting}
                      onMouseLeave={stopAdjusting}
                      onTouchStart={() => startAdjusting(item, "up")}
                      onTouchEnd={stopAdjusting}
                      disabled={item.quantity >= item.countInStock}
                      className="p-1 px-3 text-primary disabled:opacity-20 hover:text-accent transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-dark/30 uppercase tracking-widest">
                      {item.discountPrice && item.discountPrice < item.price
                        ? "Discounted Price"
                        : "Price per unit"}
                    </p>
                    {item.discountPrice && item.discountPrice < item.price ? (
                      <>
                        <p className="text-2xl font-black text-accent">
                          ${item.discountPrice}
                        </p>
                        <p className="text-sm font-bold text-text-dark/30 line-through">
                          ${item.price}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-black text-primary">
                        ${item.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 bg-primary  p-8 text-white shadow-2xl">
            <h2 className="text-xl font-black mb-8 border-b border-white/10 pb-4 tracking-tight">
              Order Summary
            </h2>

            {/* Cart Items List */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.slug}
                  className="flex justify-between items-start gap-2 pb-3 border-b border-white/10"
                >
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-white/90 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-white/50 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-black ${
                        item.discountPrice && item.discountPrice < item.price
                          ? "text-accent"
                          : "text-white"
                      }`}
                    >
                      $
                      {(
                        (item.discountPrice || item.price) * item.quantity
                      ).toLocaleString()}
                    </p>
                    <p
                      className={`text-[9px] ${
                        item.discountPrice && item.discountPrice < item.price
                          ? "text-accent/70"
                          : "text-white/40"
                      }`}
                    >
                      Save: $
                      {(
                        (item.price - (item.discountPrice || item.price)) *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 border-t border-white/10 pt-6">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/60">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                  items)
                </span>
                <span>${originalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span
                  className={
                    totalDiscount > 0 ? "text-accent" : "text-white/60"
                  }
                >
                  Total Savings
                </span>
                <span
                  className={
                    totalDiscount > 0 ? "text-accent" : "text-white/60"
                  }
                >
                  {totalDiscount > 0 ? "-" : ""}$
                  {totalDiscount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/60">Express Shipping</span>
                <span className="text-accent">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/60">Taxes & Duties</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                  Grand Total
                </span>
                <span className="text-3xl md:text-4xl font-black">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              className="w-full bg-accent hover:bg-white text-primary font-black py-5  transition-all shadow-lg active:scale-95 text-xs uppercase tracking-[0.3em] mb-4 cursor-pointer"
              onClick={() =>
                alert("Proceeding to luxury checkout secure gateway...")
              }
            >
              Secure Checkout
            </button>

            <p className="text-[10px] text-white/40 text-center leading-relaxed">
              Accepting premium payment methods: Amex, Visa, Crypto, and Apple
              Pay. All transactions are encrypted and secured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

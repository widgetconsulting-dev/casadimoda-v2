"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ShoppingBag, Package, CheckCircle, Clock, Truck } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[calc(100dvh-var(--header-height,80px))] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/bgg.webp')" }}>
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100dvh-var(--header-height,80px))] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bgg.webp')" }}
    >
      {/* Breadcrumb */}
      <div className="px-8 md:px-16 pt-8">
        <p className="text-white/40 text-xs">
          <Link href="/" className="hover:text-accent transition-colors">Accueil</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-white/60">Mes Commandes</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <div className="flex items-end justify-between mb-10">
          <h1 className="font-serif text-5xl md:text-6xl font-bold italic text-white">Mes Commandes</h1>
          {session?.user && (
            <p className="text-white/30 text-xs hidden md:block">{orders.length} commande{orders.length !== 1 ? "s" : ""}</p>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 border border-white/10 bg-white/5 flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-accent/40" />
            </div>
            <h2 className="font-serif text-3xl font-bold italic text-white mb-3">Aucune commande</h2>
            <p className="text-white/40 text-sm mb-8">Vous n&apos;avez pas encore passé de commande.</p>
            <Link
              href="/products"
              className="bg-accent text-primary px-10 py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-accent/80 transition-all"
            >
              Explorer la Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-black/40 border border-white/10">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-white/10">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Commande</p>
                      <p className="text-xs font-bold text-white/60 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Date</p>
                      <p className="text-xs text-white/60">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Total</p>
                      <p className="text-xs font-black text-accent">{order.totalPrice.toLocaleString()} TND</p>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border ${order.isPaid ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"}`}>
                      {order.isPaid ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {order.isPaid ? "Payée" : "En attente"}
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border ${order.isDelivered ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-blue-500/30 bg-blue-500/10 text-blue-400"}`}>
                      {order.isDelivered ? <CheckCircle className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                      {order.isDelivered ? "Livrée" : "En cours"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5">
                  <div className="flex flex-col gap-3">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-12 h-14 shrink-0 overflow-hidden bg-white/5 border border-white/10">
                          <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">Qté: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-black text-accent shrink-0">{(item.price * item.quantity).toLocaleString()} TND</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-2">
                    <Package className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-white/30">
                      {order.shippingAddress.fullName} — {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

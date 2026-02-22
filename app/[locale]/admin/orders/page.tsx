"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  user: { _id: string; name?: string; email?: string } | null;
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
  paidAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
}

const STATUS_TABS = [
  { key: "active", label: "Active", color: "text-blue-400" },
  { key: "paid", label: "Paid / Pending Delivery", color: "text-yellow-400" },
  { key: "delivered", label: "Delivered", color: "text-green-400" },
  { key: "all", label: "All Orders", color: "text-white/60" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${tab}&page=${page}&pageSize=15`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalOrders(data.totalOrders || 0);
      setActiveCount(data.activeCount || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [tab]);

  const updateOrder = async (orderId: string, update: { isPaid?: boolean; isDelivered?: boolean }) => {
    setUpdatingId(orderId);
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, ...update }),
      });
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Orders <span className="text-accent">Management</span>
          </h1>
          <p className="text-white/30 font-bold uppercase tracking-widest text-[10px] mt-1">
            {activeCount} active order{activeCount !== 1 ? "s" : ""} pending
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-accent/40 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-accent transition-all cursor-pointer"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 -mb-px ${
              tab === t.key
                ? `border-accent ${t.color}`
                : "border-transparent text-white/30 hover:text-white/60"
            }`}
          >
            {t.label}
            {t.key === "active" && activeCount > 0 && (
              <span className="ml-2 bg-accent text-primary text-[8px] font-black px-1.5 py-0.5">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={40} className="text-white/10 mb-4" />
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order._id} className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              {/* Row Summary */}
              <div
                className="grid grid-cols-12 gap-4 px-5 py-4 cursor-pointer items-center"
                onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
              >
                {/* ID */}
                <div className="col-span-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Order</p>
                  <p className="text-xs font-bold text-white/70 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                </div>

                {/* Customer */}
                <div className="col-span-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Customer</p>
                  <p className="text-xs font-bold text-white truncate">{order.user?.name || order.shippingAddress.fullName}</p>
                  <p className="text-[10px] text-white/30 truncate">{order.user?.email || "—"}</p>
                </div>

                {/* Date */}
                <div className="col-span-2 hidden md:block">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Date</p>
                  <p className="text-xs text-white/60">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>

                {/* Total */}
                <div className="col-span-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Total</p>
                  <p className="text-xs font-black text-accent">{order.totalPrice.toLocaleString()} TND</p>
                </div>

                {/* Status badges */}
                <div className="col-span-2 flex flex-col gap-1">
                  <span className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-2 py-1 w-fit ${order.isPaid ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {order.isPaid ? <CheckCircle size={9} /> : <Clock size={9} />}
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                  <span className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-2 py-1 w-fit ${order.isDelivered ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                    {order.isDelivered ? <CheckCircle size={9} /> : <Truck size={9} />}
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </div>

                {/* Expand */}
                <div className="col-span-1 flex justify-end">
                  {expandedId === order._id ? (
                    <ChevronUp size={16} className="text-white/30" />
                  ) : (
                    <ChevronDown size={16} className="text-white/30" />
                  )}
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedId === order._id && (
                <div className="border-t border-white/10 px-5 py-5 space-y-5">
                  {/* Items */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">Items</p>
                    <div className="space-y-2">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="relative w-10 h-12 shrink-0 bg-white/5 overflow-hidden">
                            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-white/30">Qté: {item.quantity} × {item.price.toLocaleString()} TND</p>
                          </div>
                          <p className="text-xs font-black text-accent">{(item.price * item.quantity).toLocaleString()} TND</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Shipping Address</p>
                    <p className="text-xs text-white/60">
                      {order.shippingAddress.fullName} — {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">Payment: {order.paymentMethod}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    {!order.isPaid && (
                      <button
                        disabled={updatingId === order._id}
                        onClick={() => updateOrder(order._id, { isPaid: true })}
                        className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-widest px-4 py-2 transition-all cursor-pointer disabled:opacity-40"
                      >
                        <CheckCircle size={11} /> Mark as Paid
                      </button>
                    )}
                    {order.isPaid && !order.isDelivered && (
                      <button
                        disabled={updatingId === order._id}
                        onClick={() => updateOrder(order._id, { isDelivered: true })}
                        className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest px-4 py-2 transition-all cursor-pointer disabled:opacity-40"
                      >
                        <Truck size={11} /> Mark as Delivered
                      </button>
                    )}
                    {order.isPaid && (
                      <button
                        disabled={updatingId === order._id}
                        onClick={() => updateOrder(order._id, { isPaid: false })}
                        className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest px-4 py-2 transition-all cursor-pointer disabled:opacity-40"
                      >
                        Revert Payment
                      </button>
                    )}
                    {updatingId === order._id && (
                      <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-widest">
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
            Page {page} of {pages} — {totalOrders} orders
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:border-accent/40 hover:text-accent disabled:opacity-30 cursor-pointer transition-all"
            >
              Prev
            </button>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:border-accent/40 hover:text-accent disabled:opacity-30 cursor-pointer transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

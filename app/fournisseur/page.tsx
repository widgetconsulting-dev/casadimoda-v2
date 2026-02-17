"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

interface SummaryData {
  status: string;
  businessName: string;
  totalProducts: number;
  approvedProducts: number;
  pendingProducts: number;
  rejectedProducts: number;
  totalRevenue: number;
  totalOrders: number;
  commissionRate: number;
  commissionAmount: number;
  netRevenue: number;
  rating: number;
  numReviews: number;
  recentOrders: Array<{
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    itemCount: number;
  }>;
}

export default function SupplierDashboard() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/supplier/summary");
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPending = summary?.status === "pending";
  const isApproved = summary?.status === "approved";

  return (
    <div className="space-y-8">
      {/* Welcome Banner for New Registrations */}
      {justRegistered && (
        <div className="bg-green-50 border border-green-200  p-6">
          <div className="flex items-start gap-4">
            <CheckCircle size={24} className="text-green-500 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-green-800">
                Application Submitted Successfully!
              </h3>
              <p className="text-green-700 mt-1">
                Thank you for registering as a supplier. Your application is now
                under review. We&apos;ll notify you once it&apos;s approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Status Banner */}
      {isPending && !justRegistered && (
        <div className="bg-yellow-50 border border-yellow-200  p-6">
          <div className="flex items-start gap-4">
            <Clock size={24} className="text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-800">
                Account Pending Approval
              </h3>
              <p className="text-yellow-700 mt-1">
                Your supplier account is currently under review. You can explore
                the dashboard but cannot add products until approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            Welcome back
            <span className="text-accent">.</span>
          </h1>
          <p className="text-text-dark/50 text-sm font-medium mt-1">
            {summary?.businessName || "Supplier Dashboard"}
          </p>
        </div>
        {isApproved && (
          <Link
            href="/supplier/products"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3  font-bold transition-colors"
          >
            <Plus size={20} />
            Add New Product
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white  p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">
                Total Products
              </p>
              <p className="text-3xl font-black text-primary mt-2">
                {summary?.totalProducts || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 ">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-green-500 font-bold flex items-center gap-1">
              <CheckCircle size={12} />
              {summary?.approvedProducts || 0}
            </span>
            <span className="text-yellow-500 font-bold flex items-center gap-1">
              <Clock size={12} />
              {summary?.pendingProducts || 0}
            </span>
            <span className="text-red-500 font-bold flex items-center gap-1">
              <XCircle size={12} />
              {summary?.rejectedProducts || 0}
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white  p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">
                Total Revenue
              </p>
              <p className="text-3xl font-black text-primary mt-2">
                ${(summary?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 ">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-text-dark/50">
            Net: ${(summary?.netRevenue || 0).toLocaleString()} (after{" "}
            {summary?.commissionRate || 15}% commission)
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white  p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">
                Orders
              </p>
              <p className="text-3xl font-black text-primary mt-2">
                {summary?.totalOrders || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 ">
              <ShoppingCart size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-text-dark/50">
            Orders containing your products
          </p>
        </div>

        {/* Rating */}
        <div className="bg-white  p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">
                Store Rating
              </p>
              <p className="text-3xl font-black text-primary mt-2">
                {summary?.rating?.toFixed(1) || "0.0"}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 ">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
          <p className="mt-4 text-xs text-text-dark/50">
            Based on {summary?.numReviews || 0} reviews
          </p>
        </div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white  p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-black text-primary mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/supplier/products"
              className={`flex items-center justify-between p-4  transition-colors ${
                isApproved
                  ? "bg-accent/10 hover:bg-accent/20 text-accent"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => !isApproved && e.preventDefault()}
            >
              <div className="flex items-center gap-3">
                <Plus size={20} />
                <span className="font-bold">Add New Product</span>
              </div>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/supplier/orders"
              className="flex items-center justify-between p-4 bg-secondary hover:bg-gray-200  transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-primary" />
                <span className="font-bold text-primary">View Orders</span>
              </div>
              <ArrowRight size={18} className="text-primary" />
            </Link>
            <Link
              href="/supplier/profile"
              className="flex items-center justify-between p-4 bg-secondary hover:bg-gray-200  transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-primary" />
                <span className="font-bold text-primary">Update Profile</span>
              </div>
              <ArrowRight size={18} className="text-primary" />
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white  p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-primary">Recent Orders</h3>
            <Link
              href="/supplier/orders"
              className="text-xs font-bold text-accent hover:underline"
            >
              View All
            </Link>
          </div>
          {summary?.recentOrders && summary.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {summary.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-secondary "
                >
                  <div>
                    <p className="font-bold text-primary text-sm">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-xs text-text-dark/50">
                      {order.itemCount} item(s) -{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700"
                          : order.isPaid
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.isDelivered
                        ? "Delivered"
                        : order.isPaid
                          ? "Paid"
                          : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-text-dark/40 text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-gradient-to-r from-primary to-primary/90  p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-black">Commission Rate</h3>
            <p className="text-white/70 text-sm mt-1">
              Your current platform commission is{" "}
              <span className="font-bold text-accent">
                {summary?.commissionRate || 15}%
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">
              ${(summary?.commissionAmount || 0).toLocaleString()}
            </p>
            <p className="text-white/70 text-xs">Total commission paid</p>
          </div>
        </div>
      </div>
    </div>
  );
}

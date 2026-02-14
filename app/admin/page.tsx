"use client";

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface SummaryData {
  ordersCount: number;
  productsCount: number;
  usersCount: number;
  totalSales: number;
  salesData: { _id: string; totalSales: number }[];
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/admin/summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch dashboard summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `$${summary?.totalSales?.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "+12.5%",
      isUp: true,
    },
    {
      label: "Active Orders",
      value: summary?.ordersCount,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+3.2%",
      isUp: true,
    },
    {
      label: "Boutique Items",
      value: summary?.productsCount,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "-1.5%",
      isUp: false,
    },
    {
      label: "Total Members",
      value: summary?.usersCount,
      icon: Users,
      color: "text-accent",
      bg: "bg-accent/10",
      trend: "+8.4%",
      isUp: true,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter lowercase">
            Business Summary<span className="text-accent text-5xl">.</span>
          </h1>
          <p className="text-text-dark/40 font-bold uppercase tracking-widest text-[10px] mt-2">
            Real-time performance analytics
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-primary">
              Live Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon size={24} />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                  stat.isUp
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.isUp ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-primary tracking-tight">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="col-span-3 xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight">
                Revenue Trajectory
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-dark/30 mt-1">
                Monthly performance analysis
              </p>
            </div>
            <select className="bg-secondary/50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#A1A1A1" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#A1A1A1" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#D4AF37"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="col-span-3 xl:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-primary tracking-tight">
              Quick Actions
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-dark/30 mt-1">
              Management gateways
            </p>
          </div>

          <div className="space-y-4 my-8">
            <Link
              href="/admin/products?action=create"
              className="w-full bg-primary hover:bg-black text-white text-xs font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              Add New Product <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/admin/giftcards"
              className="w-full bg-accent hover:opacity-90 text-primary text-xs font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center cursor-pointer"
            >
              Generate Gift Card
            </Link>
            <Link
              href="/admin/coupons"
              className="w-full border-2 border-primary/5 hover:border-accent/30 text-primary text-xs font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all flex items-center justify-center cursor-pointer"
            >
              Launch Discount Campaign
            </Link>
          </div>

          <div className="p-6 bg-secondary/50 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-accent" size={20} />
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                Growth Analytics
              </span>
            </div>
            <p className="text-xs text-text-dark/50 leading-relaxed">
              Your store has seen a{" "}
              <span className="text-primary font-black">24% increase</span> in
              luxury accessories sales this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

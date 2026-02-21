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
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `${summary?.totalSales?.toLocaleString()} TND`,
      icon: DollarSign,
      color: "text-accent",
      bg: "bg-accent/10",
      trend: "+12.5%",
      isUp: true,
    },
    {
      label: "Active Orders",
      value: summary?.ordersCount,
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      trend: "+3.2%",
      isUp: true,
    },
    {
      label: "Boutique Items",
      value: summary?.productsCount,
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      trend: "-1.5%",
      isUp: false,
    },
    {
      label: "Total Members",
      value: summary?.usersCount,
      icon: Users,
      color: "text-green-400",
      bg: "bg-green-500/10",
      trend: "+8.4%",
      isUp: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Business <span className="text-accent">Summary</span>
          </h1>
          <p className="text-white/30 font-bold uppercase tracking-widest text-[10px] mt-1">
            Real-time performance analytics
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
            Live
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-5 hover:border-accent/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 ${stat.isUp ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                {stat.isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-base font-black text-white">Revenue Trajectory</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">Monthly performance</p>
            </div>
            <select className="bg-white/5 border border-white/10 text-white/60 px-3 py-2 text-xs font-bold outline-none cursor-pointer focus:border-accent transition-colors">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#ffffff40" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#ffffff40" }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #ffffff20",
                    borderRadius: "0px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="totalSales" stroke="#c9a96e" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-black text-white">Quick Actions</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">Management gateways</p>
          </div>

          <div className="space-y-3 flex-1">
            <Link
              href="/admin/products?action=create"
              className="w-full bg-accent hover:bg-accent/80 text-primary text-xs font-black uppercase tracking-[0.2em] py-4 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Add New Product <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/admin/giftcards"
              className="w-full bg-white/5 border border-white/10 hover:border-accent/50 text-white text-xs font-black uppercase tracking-[0.2em] py-4 transition-all flex items-center justify-center cursor-pointer"
            >
              Generate Gift Card
            </Link>
            <Link
              href="/admin/coupons"
              className="w-full bg-white/5 border border-white/10 hover:border-accent/50 text-white text-xs font-black uppercase tracking-[0.2em] py-4 transition-all flex items-center justify-center cursor-pointer"
            >
              Launch Discount Campaign
            </Link>
          </div>

          <div className="mt-6 p-4 bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-accent" size={16} />
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Growth</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Your store has seen a <span className="text-accent font-black">24% increase</span> in luxury accessories sales this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

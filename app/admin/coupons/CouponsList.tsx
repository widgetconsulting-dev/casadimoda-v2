"use client";

import { useState } from "react";
import { Plus, Ticket, ArrowDown } from "lucide-react";
import { useForm } from "react-hook-form";

import { Coupon } from "@/types";

export default function CouponsList({
  initialCoupons,
}: {
  initialCoupons: Coupon[];
}) {
  type CouponInput = Omit<Coupon, "_id" | "isActive">;
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm<CouponInput>();

  const fetchCoupons = async () => {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data);
  };

  const onSubmit = async (data: CouponInput) => {
    await fetch("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    reset();
    setShowModal(false);
    fetchCoupons();
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tighter lowercase">
            Campaigns & Deals<span className="text-accent text-5xl">.</span>
          </h1>
          <p className="text-text-dark/40 font-bold uppercase tracking-widest text-[10px] mt-2">
            Seasonal marketing and reductions
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setShowModal(true);
          }}
          className="bg-primary hover:bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="bg-white p-6 rounded-[2rem] border border-dashed border-gray-200 hover:border-accent transition-all duration-500 relative group overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-accent/20 group-hover:text-accent transition-colors">
              <Ticket size={48} strokeWidth={1} />
            </div>
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-3 py-1 rounded-full">
                {coupon.type === "percentage" ? "Reduction" : "Flat Rate"}
              </span>
            </div>
            <h3 className="text-2xl font-black text-primary font-mono mb-1">
              {coupon.code}
            </h3>
            <div className="flex items-center gap-2 mb-6">
              <ArrowDown size={14} className="text-red-500" />
              <span className="text-lg font-black text-primary">
                {coupon.type === "percentage"
                  ? `${coupon.discount}% OFF`
                  : `$${coupon.discount} OFF`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${
                  coupon.isActive ? "text-green-500" : "text-gray-300"
                }`}
              >
                {coupon.isActive ? "Live Now" : "Inactive"}
              </span>
              <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors cursor-pointer">
                Terminate
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="col-span-full py-20 bg-secondary/20 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-center p-10">
            <Ticket size={64} className="text-gray-100" />
            <p className="max-w-xs text-xs font-bold text-text-dark/30 uppercase tracking-[0.2em] leading-relaxed">
              No marketing campaigns are currently running. Launch your first
              boutique discount today.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-primary mb-8 tracking-tight italic">
              Initiate Reduction
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-2">
                  Promotion Code
                </label>
                <input
                  {...register("code", { required: true })}
                  className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-black text-primary uppercase placeholder:lowercase"
                  placeholder="e.g. SUMMER24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-2">
                    Model
                  </label>
                  <select
                    {...register("type")}
                    className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary appearance-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-2">
                    Benefit Value
                  </label>
                  <input
                    type="number"
                    {...register("discount", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary"
                    placeholder="e.g. 20"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-primary font-black uppercase text-[10px] tracking-widest py-5 hover:bg-secondary rounded-2xl transition-all cursor-pointer"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl shadow-lg hover:bg-black transition-all cursor-pointer"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

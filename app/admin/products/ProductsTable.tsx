"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  X,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Product, SubCategory, Category } from "@/types";
import Pagination from "@/components/Pagination";

export default function ProductsTable({
  initialProducts,
  totalPages,
  subCategories,
  categories,
}: {
  initialProducts: Product[];
  totalPages: number;
  subCategories: SubCategory[];
  categories: Category[];
}) {
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<Product>();
  const productImage = watch("image");
  const selectedCategory = watch("category");
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;


  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      Object.keys(product).forEach((key) => {
        setValue(key as keyof Product, product[key as keyof Product]);
      });
    } else {
      setEditingProduct(null);
      reset({
        name: "",
        slug: "",
        category: "",
        brand: "",
        price: 0,
        discountPrice: 0,
        countInStock: 0,
        description: "",
        deliveryTime: "",
        dimensions: "",
        weight: "",
        cbm: 0,
        hsCode: "",
        isFeatured: false,
      });
    }
    setShowModal(true);
  };

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      openModal();
      // Remove the query param so it doesn't open again on refresh
      router.replace("/admin/products");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const onSubmit = async (data: Product) => {
    const url = "/api/admin/products";
    const method = editingProduct ? "PUT" : "POST";
    const body = editingProduct ? { ...data, id: editingProduct._id } : data;

    // Auto-generate slug if empty
    if (!data.slug) {
      body.slug = data.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    setSaving(true);
    const res = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    setSaving(false);
    if (res.ok) {
      setShowModal(false);
      router.refresh();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to save product");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Remove this item from the boutique registry?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tighter lowercase">
            Inventory Registry<span className="text-accent text-5xl">.</span>
          </h1>
          <p className="text-text-dark/40 font-bold uppercase tracking-widest text-[10px] mt-2">
            Control your luxury high-end stock
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} /> Enlist New Item
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/20"
              size={18}
            />
            <input
              className="w-full bg-secondary border-none rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-primary placeholder:text-gray-300"
              placeholder="Search registry..."
            />
          </div>
          <button className="bg-secondary px-6 py-4 rounded-2xl flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all cursor-pointer">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-primary">
                  Product Details
                </th>
                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-primary">
                  Category
                </th>
                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-primary">
                  Subcategory
                </th>
                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-primary">
                  Inventory
                </th>
                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-primary">
                  Retail Value
                </th>
                <th className="pb-6 text-[11px] font-black uppercase tracking-widest text-primary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialProducts.map((product) => (
                <tr
                  key={product._id}
                  className="group hover:bg-secondary/10 transition-colors"
                >
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <Image
                          src={product.image || "/images/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized={true}

                        />
                      </div>
                      <div>
                        <p className="font-black text-primary text-sm leading-tight mb-1">
                          {product.name}
                        </p>
                        <p className="text-[10px] font-bold text-text-dark/30 uppercase tracking-widest">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-black text-accent bg-accent/5 px-3 py-1 rounded-lg uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-bold text-text-dark/40 bg-secondary px-3 py-1 rounded-lg uppercase tracking-widest">
                      {product.subCategory}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${product.countInStock > 0
                          ? "bg-green-500"
                          : "bg-red-500"
                          }`}
                      />
                      <span className="text-xs font-black text-primary">
                        {product.countInStock} Units
                      </span>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex flex-col">
                      <span
                        suppressHydrationWarning
                        className={`text-lg font-black ${product.discountPrice > 0
                          ? "text-red-500"
                          : "text-primary"
                          }`}
                      >
                        $
                        {(
                          product.discountPrice || product.price
                        ).toLocaleString('en-US')}
                      </span>
                      {product.discountPrice > 0 && (
                        <span
                          suppressHydrationWarning
                          className="text-[10px] font-bold text-text-dark/30 line-through"
                        >
                          ${product.price.toLocaleString('en-US')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(product)}
                        className="p-3 bg-secondary text-primary rounded-xl hover:bg-white hover:text-accent shadow-sm transition-all cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-3 bg-secondary text-primary rounded-xl hover:bg-red-50 hover:text-red-500 shadow-sm transition-all cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Package size={48} className="text-gray-100" />
                      <p className="text-xs font-bold text-text-dark/30 uppercase tracking-[0.2em]">
                        Boutique inventory is currently empty.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pb-8">
          <Pagination totalPages={totalPages} />
        </div>
      </div>

      {/* Premium Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-10 pb-4 flex justify-between items-center bg-white z-10">
              <h2 className="text-3xl font-black text-primary tracking-tight">
                {editingProduct ? "Refine Masterpiece" : "Enlist New Creation"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-secondary rounded-full transition-all cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
              <div className="flex-grow overflow-y-auto p-10 pt-4 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Side: General Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                        Creation Name
                      </label>
                      <input
                        {...register("name", { required: true })}
                        className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary"
                        placeholder="e.g. Silk Evening Gown"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                          Category
                        </label>
                        <select
                          {...register("category", { required: true })}
                          className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary appearance-none"
                        >
                          <option value="">Select category...</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                          SubCategory
                        </label>
                        <select
                          {...register("subCategory", { required: true })}
                          className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary appearance-none"
                        >
                          <option value="">Select subcategory...</option>
                          {subCategories
                            .filter(sub => !selectedCategory || sub.parentCategory === selectedCategory)
                            .map(sub => (
                              <option key={sub._id} value={sub.name}>{sub.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                        Brand
                      </label>
                      <input
                        {...register("brand", { required: true })}
                        className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary"
                        placeholder="e.g. Dior"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                          Original Price
                        </label>
                        <input
                          type="number"
                          {...register("price", { required: true })}
                          className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                          Discount Price
                        </label>
                        <input
                          type="number"
                          {...register("discountPrice")}
                          className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-red-500"
                          placeholder="Optional"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                          In Stock
                        </label>
                        <input
                          type="number"
                          {...register("countInStock", { required: true })}
                          className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Media & Details */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                        Primary Asset (URL)
                      </label>
                      <div className="flex flex-col gap-4">
                        {productImage && (
                          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-secondary border border-gray-100 mb-2">
                            <Image
                              src={productImage}
                              alt="Preview"
                              fill
                              className="object-contain"
                              unoptimized={true}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020&auto=format&fit=crop";
                              }}
                            />
                          </div>
                        )}
                        <div className="relative">
                          <input
                            {...register("image", { required: true })}
                            className="w-full bg-secondary border-none rounded-2xl p-4 pl-12 outline-none font-bold text-primary"
                            placeholder="Select or enter URL"
                          />
                          <Upload
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30"
                            size={18}
                          />
                        </div>
                        <CldUploadWidget
                          uploadPreset="iqsmn6rq"
                          onSuccess={(result: any) => {
                            setValue("image", result.info.secure_url);
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="w-full bg-accent/10 border-2 border-dashed border-accent/30 text-accent font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl hover:bg-accent/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Upload size={14} /> Upload to Cloudinary
                            </button>
                          )}
                        </CldUploadWidget>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                        Narrative Description
                      </label>
                      <textarea
                        {...register("description", { required: true })}
                        className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary min-h-[120px]"
                        placeholder="Tell the story of this masterpiece..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                          Delivery Time
                        </label>
                        <input
                          {...register("deliveryTime")}
                          className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary"
                          placeholder="e.g. 3-5 days"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                          Dimensions
                        </label>
                        <input
                          {...register("dimensions")}
                          className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-bold text-primary"
                          placeholder="e.g. 20x30x10 cm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary rounded-2xl">
                      <input
                        type="checkbox"
                        {...register("isFeatured")}
                        className="w-5 h-5 accent-accent"
                        id="isFeatured"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="text-[11px] font-black uppercase tracking-widest text-primary cursor-pointer"
                      >
                        Featured Creation
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-primary ml-2">
                        Registry Slug (Optional)
                      </label>
                      <input
                        {...register("slug")}
                        className="w-full bg-secondary border-none rounded-2xl p-4 outline-none font-mono text-xs text-text-dark/50"
                        placeholder="silk-evening-gown"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-10 pt-6 border-t border-gray-50 flex gap-4 bg-white">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-primary font-black uppercase text-[10px] tracking-widest py-6 hover:bg-secondary rounded-2xl transition-all cursor-pointer"
                >
                  Abort Mission
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white font-black uppercase text-[10px] tracking-widest py-6 rounded-2xl shadow-xl hover:bg-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Committing..." : "Commit to Registry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

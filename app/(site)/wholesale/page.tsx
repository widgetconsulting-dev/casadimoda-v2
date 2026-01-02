import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";
import Pagination from "@/components/Pagination";
import db from "@/utils/db";
import ProductModel from "@/models/Product";
import { MongoDocument } from "@/utils/db";
import { Package } from "lucide-react";

export default async function WholesalePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  await db.connect();
  const totalProducts = await ProductModel.countDocuments();
  const docs = await ProductModel.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean();

  const products = docs.map(
    (doc) => db.convertDocToObj(doc as MongoDocument) as unknown as Product
  );
  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-8 md:p-12 mb-12 text-white">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0">
            <Package size={32} className="text-primary" />
          </div>
          <div className="flex-grow">
            <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-3">
              Wholesale & Bulk Orders
            </h2>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Professional Partnership
            </h1>
            <p className="text-white/80 max-w-2xl text-sm leading-relaxed mb-6">
              Unlock exclusive wholesale pricing for bulk purchases. Perfect for
              retailers, boutiques, and business partners. Minimum order
              quantities apply.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-accent font-black text-xs uppercase tracking-widest mb-2">
                  Minimum Order
                </p>
                <p className="text-2xl font-black">50+ Units</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-accent font-black text-xs uppercase tracking-widest mb-2">
                  Bulk Discount
                </p>
                <p className="text-2xl font-black">Up to 40%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-accent font-black text-xs uppercase tracking-widest mb-2">
                  Payment Terms
                </p>
                <p className="text-2xl font-black">Net 30</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-3">
            Wholesale Catalog
          </h2>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
            Available Products
          </h1>
        </div>
        <div className="text-right">
          <p className="text-text-dark/60 max-w-md text-sm leading-relaxed mb-2">
            Browse our full catalog and contact us for wholesale pricing and
            terms.
          </p>
          <p className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">
            Showing {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, totalProducts)} of {totalProducts}{" "}
            Products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>

      <Pagination totalPages={totalPages} />

      {/* Contact CTA */}
      <div className="mt-16 bg-secondary rounded-3xl p-8 md:p-12 text-center">
        <h3 className="text-2xl font-black text-primary mb-4">
          Ready to Start Your Wholesale Partnership?
        </h3>
        <p className="text-text-dark/60 mb-8 max-w-2xl mx-auto">
          Contact our wholesale team to discuss pricing, minimum orders, and
          exclusive partnership opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:wholesale@casadimoda.com"
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-primary transition-all shadow-lg"
          >
            Email Wholesale Team
          </a>
          <a
            href="/vip-store"
            className="bg-white text-primary px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-lg border-2 border-primary"
          >
            VIP Store
          </a>
        </div>
      </div>
    </div>
  );
}

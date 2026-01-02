import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";
import Pagination from "@/components/Pagination";
import db from "@/utils/db";
import ProductModel from "@/models/Product";
import { MongoDocument } from "@/utils/db";
import SortSelect from "@/components/SortSelect";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sort = params.sort || "newest";
  const pageSize = 16;
  const skip = (page - 1) * pageSize;

  const order: Record<string, 1 | -1> =
    sort === "featured"
      ? { isFeatured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  await db.connect();
  const totalProducts = await ProductModel.countDocuments();
  const docs = await ProductModel.find({})
    .sort(order)
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
      <div className="bg-gradient-to-br from-primary via-primary/95 to-accent rounded-3xl p-8 md:p-12 mb-12 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-white/80 font-bold uppercase tracking-[0.3em] text-xs mb-4">
              Complete Catalog
            </h2>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              All Products
            </h1>
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              Browse our complete collection of luxury fashion, high-end
              accessories, and exclusive items. Every piece is carefully curated
              for discerning customers.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="font-bold">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="font-bold">Curated Selection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="font-bold">Express Shipping</span>
              </div>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black uppercase text-white/70 tracking-[0.2em] mb-2">
              Premium Items Available
            </p>
            <p className="text-6xl font-black text-accent mb-2">
              {totalProducts}
            </p>
            <p className="text-xs text-white/70">
              Showing {(page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, totalProducts)}
            </p>
          </div>
        </div>
      </div>

      {/* Sort and Filter Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">
              Discover Your Style
            </h2>
            <p className="text-text-dark/60 text-sm mt-1">
              Refine your selection with our advanced sorting options
            </p>
          </div>
        </div>

        {/* Sort and Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <p className="text-sm font-bold text-primary">
              Refine Your Selection
            </p>
          </div>
          <SortSelect currentSort={sort} />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>

      {/* No Products Message */}
      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-bold text-text-dark/30 mb-4">
            No products available at the moment
          </p>
          <p className="text-text-dark/50">Please check back soon</p>
        </div>
      )}

      <Pagination totalPages={totalPages} />

      {/* Bottom CTA */}
      <div className="mt-16 bg-gradient-to-br from-secondary to-gray-50 rounded-3xl p-8 md:p-12 text-center">
        <h3 className="text-2xl font-black text-primary mb-4">
          Looking for Something Specific?
        </h3>
        <p className="text-text-dark/60 mb-8 max-w-2xl mx-auto">
          Can&apos;t find what you&apos;re looking for? Our VIP team can help
          you source exclusive items or create custom orders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/search"
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-primary transition-all shadow-lg"
          >
            Advanced Search
          </a>
          <a
            href="/vip-store"
            className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary transition-all shadow-lg"
          >
            Contact VIP Team
          </a>
        </div>
      </div>
    </div>
  );
}

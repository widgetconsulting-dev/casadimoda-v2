import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";
import Pagination from "@/components/Pagination";
import db from "@/utils/db";
import ProductModel from "@/models/Product";
import { MongoDocument } from "@/utils/db";
import SortSelect from "@/components/SortSelect";
import Link from "next/link";

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
    (doc) => db.convertDocToObj(doc as MongoDocument) as unknown as Product,
  );
  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="bg-[#2a2a2a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
            <div>
              <p className="text-accent font-medium uppercase tracking-[0.4em] text-[10px] md:text-xs mb-2">
                Collection Complète
              </p>
              <h1 className="font-serif text-2xl md:text-4xl text-white italic">
                Tous les Produits
              </h1>
            </div>
            <p className="text-white/30 text-xs">
              {totalProducts} produits ·{" "}
              {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalProducts)}
            </p>
          </div>

          {/* Sort Bar */}
          <div className="bg-[#363636] border border-white/[0.08] p-3 md:p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-5 bg-accent" />
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Trier par
              </p>
            </div>
            <SortSelect currentSort={sort} />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {products.map((product) => (
            <ProductItem key={product.slug} product={product} />
          ))}
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-white/20 mb-3">
              Aucun produit disponible
            </p>
            <p className="text-white/30 text-sm">Revenez bientôt</p>
          </div>
        )}

        <Pagination totalPages={totalPages} />

        {/* Bottom CTA */}
        <div className="mt-12 bg-primary border border-white/[0.08] p-8 md:p-12 text-center">
          <h3 className="font-serif text-xl md:text-2xl text-white italic mb-3">
            Vous cherchez quelque chose de spécifique ?
          </h3>
          <p className="text-white/40 mb-6 max-w-xl mx-auto text-sm">
            Notre équipe VIP peut vous aider à trouver des articles exclusifs ou
            créer des commandes personnalisées.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search"
              className="bg-accent text-white px-8 py-3 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-primary transition-all"
            >
              Recherche Avancée
            </Link>
            <Link
              href="/vip-store"
              className="border border-white/20 text-white px-8 py-3 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-primary transition-all"
            >
              Contacter le VIP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

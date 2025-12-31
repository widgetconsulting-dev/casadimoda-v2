import db, { MongoDocument } from "@/utils/db";
import ProductModel from "@/models/Product";
import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";

export default async function Home() {
  await db.connect();
  const docs = await ProductModel.find({}).lean();
  const products: Product[] = docs.map((doc: MongoDocument) =>
    db.convertDocToObj(doc)
  ) as unknown as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-3">
            Pure Elegance
          </h2>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
            Latest Collection
          </h1>
        </div>
        <p className="text-text-dark/60 max-w-md text-sm leading-relaxed">
          Discover our curated selection of high-end fashion and luxury
          accessories, crafted for those who appreciate the finer things in
          life.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}

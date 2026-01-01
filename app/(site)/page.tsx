
import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";
import Pagination from "@/components/Pagination";
import db from "@/utils/db";
import ProductModel from "@/models/Product";
import { MongoDocument } from "@/utils/db";

export default async function Home({
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
    await db.disconnect();

    const products = docs.map(doc => db.convertDocToObj(doc as MongoDocument) as unknown as Product);
    const totalPages = Math.ceil(totalProducts / pageSize);
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
                <div className="text-right">
                    <p className="text-text-dark/60 max-w-md text-sm leading-relaxed mb-2">
                        Discover our curated selection of high-end fashion and luxury
                        accessories.
                    </p>
                    <p className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">
                        Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalProducts)} of {totalProducts} Masterpieces
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductItem key={product.slug} product={product} />
                ))}
            </div>

            <Pagination totalPages={totalPages} />
        </div>
    );
}

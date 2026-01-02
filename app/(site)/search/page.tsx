import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";
import SearchSidebar from "./SearchSidebar";
import Link from "next/link";
import { X } from "lucide-react";
import db, { MongoDocument } from "@/utils/db";
import ProductModel from "@/models/Product";
import SortSelect from "@/components/SortSelect";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subCategory?: string;
    brand?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const {
    q = "all",
    category = "all",
    subCategory = "all",
    brand = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = params;

  const pageNumber = Number(page) || 1;
  const pageSize = 12;

  await db.connect();

  const queryFilter =
    q && q !== "all"
      ? {
          name: {
            $regex: q,
            $options: "i",
          },
        }
      : {};

  const categoryFilter = category && category !== "all" ? { category } : {};
  const subCategoryFilter =
    subCategory && subCategory !== "all" ? { subCategory } : {};
  const brandFilter = brand && brand !== "all" ? { brand } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  // Price filter handling: "min-max"
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

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

  const filter = {
    ...queryFilter,
    ...categoryFilter,
    ...subCategoryFilter,
    ...brandFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  const [productDocs, countProducts, categoriesList, brandsList] =
    await Promise.all([
      ProductModel.find(filter)
        .sort(order)
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize)
        .lean(),
      ProductModel.countDocuments(filter),
      ProductModel.find().distinct("category"),
      ProductModel.find().distinct("brand"),
    ]);

  const products = productDocs.map(
    (doc) => db.convertDocToObj(doc as MongoDocument) as unknown as Product
  );
  const pages = Math.ceil(countProducts / pageSize);
  const categories: string[] = categoriesList;
  const brands: string[] = brandsList;

  const getFilterUrl = (key: string, value: string) => {
    const newParams = new URLSearchParams();
    if (q && q !== "all") newParams.set("q", q);
    if (category && category !== "all") newParams.set("category", category);
    if (subCategory && subCategory !== "all")
      newParams.set("subCategory", subCategory);
    if (brand && brand !== "all") newParams.set("brand", brand);
    if (price && price !== "all") newParams.set("price", price);
    if (rating && rating !== "all") newParams.set("rating", rating);
    if (sort && sort !== "newest") newParams.set("sort", sort);
    if (page && page !== "1") newParams.set("page", page);

    newParams.set(key, value);
    if (key !== "page") newParams.set("page", "1");

    return `/search?${newParams.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <SearchSidebar
            categories={categories}
            brands={brands}
            category={category}
            brand={brand}
            price={price}
            rating={rating}
            sort={sort}
          />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-xl font-black text-primary">
                {q !== "all" ? `Results for &ldquo;${q}&rdquo;` : "All Collections"}
              </h1>
              <p className="text-xs text-text-dark/50 font-bold uppercase tracking-widest mt-1">
                {countProducts}{" "}
                {countProducts === 1 ? "Masterpiece" : "Masterpieces"} Found
              </p>
            </div>

            <SortSelect currentSort={sort} />
          </div>

          {/* Active Filters Display */}
          {(category !== "all" ||
            brand !== "all" ||
            price !== "all" ||
            rating !== "all" ||
            (q !== "all" && q !== "")) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {q !== "all" && q !== "" && (
                <Link
                  href={getFilterUrl("q", "all")}
                  className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black transition-colors"
                >
                  &ldquo;{q}&rdquo; <X size={12} />
                </Link>
              )}
              {category !== "all" && (
                <Link
                  href={getFilterUrl("category", "all")}
                  className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors"
                >
                  {category} <X size={12} />
                </Link>
              )}
              {brand !== "all" && (
                <Link
                  href={getFilterUrl("brand", "all")}
                  className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors"
                >
                  {brand} <X size={12} />
                </Link>
              )}
              {price !== "all" && (
                <Link
                  href={getFilterUrl("price", "all")}
                  className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors"
                >
                  Price: {price} <X size={12} />
                </Link>
              )}
              <Link
                href="/search"
                className="text-[10px] font-bold text-red-500 underline ml-2 hover:text-red-700"
              >
                Clear All
              </Link>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-bold text-text-dark/30">
                No results found matching your criteria.
              </p>
              <button className="mt-4 bg-primary text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                View Latest Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  href={getFilterUrl("page", (x + 1).toString())}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-black ${
                    Number(page) === x + 1
                      ? "bg-accent text-primary"
                      : "bg-secondary text-text-dark/50 hover:bg-gray-200"
                  } transition-all`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

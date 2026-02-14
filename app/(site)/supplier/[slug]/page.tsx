import db from "@/utils/db";
import Supplier from "@/models/Supplier";
import Product from "@/models/Product";
import { Product as ProductType, Supplier as SupplierType } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Store, Star, Package, MapPin } from "lucide-react";
import ProductItem from "@/components/ProductItem";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SupplierStorefrontPage({ params }: Props) {
  const { slug } = await params;

  await db.connect();

  const supplierDoc = await Supplier.findOne({
    businessSlug: slug,
    status: "approved",
  }).lean();

  if (!supplierDoc) {
    notFound();
  }

  const products = await Product.find({
    supplier: supplierDoc._id,
    approvalStatus: "approved",
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const supplier = db.convertDocToObj(supplierDoc) as unknown as SupplierType;
  const supplierProducts = products.map((p) => db.convertDocToObj(p) as unknown as ProductType);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary to-primary/80">
        {supplier.businessBanner && (
          <Image
            src={supplier.businessBanner}
            alt={supplier.businessName}
            fill
            className="object-cover opacity-30"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
      </div>

      {/* Supplier Info Card */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-lg -mt-16 md:-mt-20">
              {supplier.businessLogo ? (
                <Image
                  src={supplier.businessLogo}
                  alt={supplier.businessName}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <Store size={48} className="text-accent" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
                {supplier.businessName}
              </h1>
              {supplier.businessDescription && (
                <p className="text-text-dark/60 mt-2 max-w-2xl">
                  {supplier.businessDescription}
                </p>
              )}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-primary">
                    {supplier.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-text-dark/40">
                    ({supplier.numReviews || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-dark/60">
                  <Package size={16} />
                  <span>{supplier.totalProducts || 0} products</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-dark/60">
                  <MapPin size={16} />
                  <span>
                    {supplier.address.city}, {supplier.address.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black text-primary mb-8">
          Products from {supplier.businessName}
        </h2>

        {supplierProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="text-gray-200 mx-auto mb-4" />
            <p className="text-text-dark/40 font-bold">
              No products available yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {supplierProducts.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  await db.connect();
  const supplier = await Supplier.findOne({
    businessSlug: slug,
    status: "approved",
  }).lean();

  if (!supplier) {
    return {
      title: "Supplier Not Found",
    };
  }

  return {
    title: `${supplier.businessName} - Casa di Moda`,
    description:
      supplier.businessDescription ||
      `Shop products from ${supplier.businessName} on Casa di Moda`,
  };
}

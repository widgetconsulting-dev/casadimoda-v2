import { notFound } from "next/navigation";
import ProductDetailsContent from "@/components/ProductDetailsContent";
import db from "@/utils/db";
import Product from "@/models/Product";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if (!product) {
    notFound();
  }

  // Convert mongoose document to plain object and fix _id serialization if needed
  const serializedProduct = {
    ...product,
    _id: product._id.toString(),
    createdAt: product.createdAt?.toString(),
    updatedAt: product.updatedAt?.toString(),
  };

  return <ProductDetailsContent product={serializedProduct as any} />;
}

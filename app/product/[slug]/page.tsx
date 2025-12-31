import db, { MongoDocument } from "@/utils/db";
import ProductModel from "@/models/Product";
import { notFound } from "next/navigation";
import ProductDetailsContent from "@/components/ProductDetailsContent";
import { Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductScreen({ params }: PageProps) {
  const { slug } = await params;

  await db.connect();
  const doc = await ProductModel.findOne({ slug }).lean();

  if (!doc) {
    return notFound();
  }

  const product = db.convertDocToObj(
    doc as MongoDocument
  ) as unknown as Product;

  return <ProductDetailsContent product={product} />;
}

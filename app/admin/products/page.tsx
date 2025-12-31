import db, { MongoDocument } from "@/utils/db";
import ProductModel from "@/models/Product";
import ProductsTable from "./ProductsTable";
import { Product } from "@/types";

export default async function AdminProductsPage() {
  await db.connect();
  const products = await ProductModel.find({}).lean();

  const serializedProducts: Product[] = products.map((doc: MongoDocument) => {
    return db.convertDocToObj(doc) as unknown as Product;
  });

  return <ProductsTable initialProducts={serializedProducts} />;
}

import db from "@/utils/db";
import BrandModel from "@/models/Brand";
import BrandsList from "./BrandsList";
import { Brand } from "@/types";

export default async function AdminBrandsPage() {
  await db.connect();
  const brands = await BrandModel.find({}).lean();

  const serializedBrands: Brand[] = brands.map(
    (doc: Omit<Brand, "_id"> & { _id: { toString: () => string } }) => {
      return db.convertDocToObj(doc) as unknown as Brand;
    }
  );

  return <BrandsList initialBrands={serializedBrands} />;
}

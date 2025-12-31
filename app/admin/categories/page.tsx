import db, { MongoDocument } from "@/utils/db";
import CategoryModel from "@/models/Category";
import CategoriesList from "./CategoriesList";
import { Category } from "@/types";

export default async function AdminCategoriesPage() {
  await db.connect();
  const categories = await CategoryModel.find({}).lean();

  const serializedCategories: Category[] = categories.map(
    (doc: MongoDocument) => {
      return db.convertDocToObj(doc) as unknown as Category;
    }
  );

  return <CategoriesList initialCategories={serializedCategories} />;
}

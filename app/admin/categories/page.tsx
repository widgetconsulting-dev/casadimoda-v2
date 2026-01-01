import CategoriesList from "./CategoriesList";
import { Category } from "@/types";
import { getBaseUrl } from "@/utils";

export default async function AdminCategoriesPage() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/admin/categories`, { cache: 'no-store' });
  const categories: Category[] = await res.json();

  return <CategoriesList initialCategories={categories} />;
}

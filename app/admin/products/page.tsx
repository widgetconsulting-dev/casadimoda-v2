import ProductsTable from "./ProductsTable";
import { Product, SubCategory, Category } from "@/types";
import { getBaseUrl } from "@/utils";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  // Fetch from API instead of direct DB access
  const baseUrl = getBaseUrl();

  const [productsRes, subCategoriesRes, categoriesRes] = await Promise.all([
    fetch(`${baseUrl}/api/admin/products?page=${page}`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/admin/subcategories`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/admin/categories`, { cache: 'no-store' })
  ]);

  const productsData = await productsRes.json();
  const subCategories: SubCategory[] = await subCategoriesRes.json();
  const categories: Category[] = await categoriesRes.json();

  return (
    <ProductsTable
      initialProducts={productsData.products}
      totalPages={productsData.totalPages}
      subCategories={subCategories}
      categories={categories}
    />
  );
}

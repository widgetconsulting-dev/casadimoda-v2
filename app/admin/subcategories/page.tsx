import SubCategoriesList from "./SubCategoriesList";
import { SubCategory, Category } from "@/types";
import { getBaseUrl } from "@/utils";

export default async function AdminSubcategoriesPage() {
    const baseUrl = getBaseUrl();

    const [subCategoriesRes, categoriesRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/subcategories`, { cache: 'no-store' }),
        fetch(`${baseUrl}/api/admin/categories`, { cache: 'no-store' })
    ]);

    const subCategories: SubCategory[] = await subCategoriesRes.json();
    const categories: Category[] = await categoriesRes.json();

    return (
        <SubCategoriesList
            initialSubCategories={subCategories}
            categories={categories}
        />
    );
}

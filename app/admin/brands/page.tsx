import BrandsList from "./BrandsList";
import { Brand } from "@/types";
import { getBaseUrl } from "@/utils";

export default async function AdminBrandsPage() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/admin/brands`, { cache: 'no-store' });
  const brands: Brand[] = await res.json();

  return <BrandsList initialBrands={brands} />;
}

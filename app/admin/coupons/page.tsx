import CouponsList from "./CouponsList";
import { Coupon } from "@/types";
import { getBaseUrl } from "@/utils";

export default async function AdminCouponsPage() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/admin/coupons`, { cache: 'no-store' });
  const coupons: Coupon[] = await res.json();

  return <CouponsList initialCoupons={coupons} />;
}

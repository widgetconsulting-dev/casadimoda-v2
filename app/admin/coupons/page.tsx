import db, { MongoDocument } from "@/utils/db";
import CouponModel from "@/models/Coupon";
import CouponsList from "./CouponsList";
import { Coupon } from "@/types";

export default async function AdminCouponsPage() {
  await db.connect();
  const coupons = await CouponModel.find({}).lean();

  const serializedCoupons: Coupon[] = coupons.map((doc: MongoDocument) => {
    return db.convertDocToObj(doc) as unknown as Coupon;
  });

  return <CouponsList initialCoupons={serializedCoupons} />;
}

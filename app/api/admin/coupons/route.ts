import db from "@/utils/db";
import Coupon from "@/models/Coupon";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  await db.connect();
  const coupons = await Coupon.find({});
  await db.disconnect();
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await db.connect();
  const coupon = await Coupon.create(body);
  await db.disconnect();
  return NextResponse.json(coupon, { status: 201 });
}

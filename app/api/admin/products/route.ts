import db from "@/utils/db";
import Product from "@/models/Product";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await db.connect();
  const product = await Product.create(body);
  await db.disconnect();
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updateData } = body;
  await db.connect();
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  await db.disconnect();
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ message: "ID required" }, { status: 400 });
  await db.connect();
  await Product.findByIdAndDelete(id);
  await db.disconnect();
  return NextResponse.json({ message: "Product deleted" });
}

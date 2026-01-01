import db from "@/utils/db";
import Product from "@/models/Product";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 12;
    const skip = (page - 1) * pageSize;

    await db.connect();
    const totalProducts = await Product.countDocuments();
    const products = await Product.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);
    await db.disconnect();

    return NextResponse.json({
        products,
        totalPages: Math.ceil(totalProducts / pageSize),
        totalProducts,
    });
}

import db from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.connect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const serialized = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      user: order.user.toString(),
      createdAt: order.createdAt?.toString(),
      updatedAt: order.updatedAt?.toString(),
      paidAt: order.paidAt?.toString(),
      deliveredAt: order.deliveredAt?.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}

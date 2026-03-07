import db from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, totalPrice } = body;

    if (!orderItems?.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await db.connect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const order = new Order({
      user: user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    const createdOrder = await order.save();
    return NextResponse.json({ _id: createdOrder._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId, cancellationReason, confirmReception } = await req.json();
    if (!orderId) {
      return NextResponse.json({ message: "orderId required" }, { status: 400 });
    }

    await db.connect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const order = await Order.findOne({ _id: orderId, user: user._id });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (confirmReception) {
      if (!order.isDelivered) {
        return NextResponse.json({ message: "Order not yet delivered" }, { status: 400 });
      }
      order.isConfirmedByClient = true;
      order.confirmedAt = new Date();
      await order.save();
      return NextResponse.json({ message: "Reception confirmed" });
    }

    if (order.isPaid || order.isDelivered || order.isCancelled) {
      return NextResponse.json({ message: "Cannot cancel this order" }, { status: 400 });
    }

    order.isCancelled = true;
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || "";
    order.cancelledBy = "client";
    await order.save();

    return NextResponse.json({ message: "Order cancelled" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json({ message: "Error cancelling order" }, { status: 500 });
  }
}

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

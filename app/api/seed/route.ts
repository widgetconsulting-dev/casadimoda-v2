import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Order from "@/models/Order";
import data from "@/utils/data";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await db.connect();

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Order.deleteMany();

    const hashedUsers = data.users.map((user) => ({
      ...user,
      password: bcryptjs.hashSync(user.password),
    }));
    const createdUsers = await User.insertMany(hashedUsers);

    await Category.insertMany(data.categories);
    await Brand.insertMany(data.brands);
    await Product.insertMany(data.products);

    const regularUser = createdUsers.find((u) => !u.isAdmin);

    if (regularUser) {
      const months = ["07", "08", "09", "10", "11", "12"];
      const mockOrders = months.map((m, i) => ({
        user: regularUser._id,
        orderItems: [
          {
            name: "Boutique Item",
            quantity: 1,
            image: "/images/item.jpg",
            price: 1000 * (i + 1),
          },
        ],
        shippingAddress: {
          fullName: "John Doe",
          address: "123 Lux St",
          city: "Tunis",
          postalCode: "1001",
          country: "Tunisia",
        },
        paymentMethod: "Card",
        itemsPrice: 1000 * (i + 1),
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 1000 * (i + 1),
        isPaid: true,
        paidAt: new Date(`2025-${m}-15`),
      }));
      await Order.insertMany(mockOrders);
    }

    await db.disconnect();
    return NextResponse.json({
      message: "Full boutique seeded with historical data",
    });
  } catch (error: unknown) {
    await db.disconnect();
    return NextResponse.json(
      { message: "Seeding failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}

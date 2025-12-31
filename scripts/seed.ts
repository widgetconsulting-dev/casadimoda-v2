import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import data from "../utils/data";
import User from "../models/User";
import Product from "../models/Product";
import Category from "../models/Category";
import Brand from "../models/Brand";
import Order from "../models/Order";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/casadimoda";

async function seed() {
  try {
    console.log("--- Connecting to database... ---");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    console.log("--- Purging existing data... ---");
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Order.deleteMany();

    console.log("--- Seeding premium users... ---");
    const hashedUsers = data.users.map((user) => ({
      ...user,
      password: bcryptjs.hashSync(user.password),
    }));
    const createdUsers = await User.insertMany(hashedUsers);

    console.log("--- Seeding collections and brands... ---");
    await Category.insertMany(data.categories);
    await Brand.insertMany(data.brands);

    console.log("--- Seeding luxury inventory... ---");
    await Product.insertMany(data.products);

    console.log("--- Minting mock business history... ---");
    const adminUser = createdUsers.find((u) => u.isAdmin);
    const regularUser = createdUsers.find((u) => !u.isAdmin);

    if (adminUser && regularUser) {
      const mockOrders = [
        {
          user: regularUser._id,
          orderItems: [
            {
              name: "Aviator Leather",
              quantity: 1,
              image: "/images/leather_jacket.png",
              price: 250,
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
          itemsPrice: 250,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 250,
          isPaid: true,
          paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
          user: regularUser._id,
          orderItems: [
            {
              name: "Omega Seamaster",
              quantity: 1,
              image: "/images/watch.png",
              price: 4500,
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
          itemsPrice: 4500,
          shippingPrice: 100,
          taxPrice: 900,
          totalPrice: 5500,
          isPaid: true,
          paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        },
      ];
      await Order.insertMany(mockOrders);
    }

    console.log("--- SEEDING COMPLETE: Boutique is ready. ---");
    process.exit(0);
  } catch (error) {
    console.error("--- SEEDING FAILED! ---");
    console.error(error);
    process.exit(1);
  }
}

seed();

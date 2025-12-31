import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "@/utils/context/Store";

import db from "@/utils/db";
import ProductModel from "@/models/Product";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casa Di Moda | Luxury Boutique",
  description: "Exclusive high-end fashion, jewelry, and luxury accessories.",
  icons: {
    icon: "/favicon.svg",
  },
};

import { AuthProvider } from "@/components/AuthProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await db.connect();
  const docs = await ProductModel.find({}).lean();

  // Extract unique data
  const categories = Array.from(new Set(docs.map((p) => p.category)));
  const brands = Array.from(new Set(docs.map((p) => p.brand)));

  // Group subcategories by category
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat] = Array.from(
      new Set(
        docs
          .filter((p) => p.category === cat)
          .map((p) => p.subCategory)
          .filter(Boolean)
      )
    ) as string[];
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-secondary text-text-dark`}
      >
        <AuthProvider>
          <StoreProvider>
            <NextTopLoader color="#D4AF37" showSpinner={false} height={3} />
            <Header
              categories={categories}
              brands={brands}
              categoryMap={categoryMap}
            />
            <main className="flex-grow sm:p-2 md:p-3 lg:p-5">{children}</main>
            <Footer />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

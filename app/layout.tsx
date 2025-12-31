import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "@/utils/context/Store";
import { AuthProvider } from "@/components/AuthProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-secondary text-text-dark`}
      >
        <AuthProvider>
          <StoreProvider>
            <NextTopLoader color="#D4AF37" showSpinner={false} height={3} />
            {children}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

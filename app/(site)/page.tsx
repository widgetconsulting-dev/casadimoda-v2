import { Product } from "@/types";
import db from "@/utils/db";
import ProductModel from "@/models/Product";
import { MongoDocument } from "@/utils/db";
import Link from "next/link";
import { Package, Crown, ShoppingBag, ArrowRight } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedProductsGrid from "@/components/FeaturedProductsGrid";

export default async function Home() {
  await db.connect();

  // Get all featured products for the home page
  const featuredDocs = await ProductModel.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .lean();

  const featuredProducts = featuredDocs.map(
    (doc) => db.convertDocToObj(doc as MongoDocument) as unknown as Product,
  );

  // Hero carousel slides
  const heroSlides = [
    {
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
      alt: "New Season Collection",
      title: "New Season Arrivals",
      subtitle: "Spring Collection 2026",
      description:
        "Be the first to explore our latest collection featuring exclusive designs from renowned fashion houses around the world.",
      cta1Text: "Shop New Arrivals",
      cta1Link: "/products?sort=newest",
      cta2Text: "View Lookbook",
      cta2Link: "/products",
    },
    {
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
      alt: "Luxury Fashion Collection",
      title: "Luxury Redefined",
      subtitle: "Welcome to Casa di Moda",
      description:
        "Discover our curated collection of high-end fashion, exclusive accessories, and bespoke services tailored for discerning customers.",
      cta1Text: "Explore Collection",
      cta1Link: "/products",
      cta2Text: "VIP Services",
      cta2Link: "/vip-store",
    },
    {
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070",
      alt: "VIP Exclusive",
      title: "VIP Exclusive Access",
      subtitle: "Members Only",
      description:
        "Join our VIP program for exclusive access to limited editions, personalized styling, and priority service from our concierge team.",
      cta1Text: "Become a VIP",
      cta1Link: "/vip-store",
      cta2Text: "Learn More",
      cta2Link: "/wholesale",
    },
    {
      type: "video" as const,
      src: "https://cdn.coverr.co/videos/coverr-elegant-woman-in-a-luxurious-outfit-4571/1080p.mp4",
      alt: "Luxury Fashion Video",
      title: "Experience Elegance",
      subtitle: "Casa di Moda - Winter 2026",
      description:
        "Immerse yourself in the world of haute couture. Watch our exclusive collection come to life with stunning craftsmanship and timeless design.",
      cta1Text: "Watch Full Collection",
      cta1Link: "/products",
      cta2Text: "Book Consultation",
      cta2Link: "/vip-store",
    },
  ];

  return (
    <div>
      {/* Full-width Hero Carousel */}
      <HeroCarousel slides={heroSlides} autoplayInterval={5000} />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 lg:py-12 sm:p-2 md:p-3 lg:p-5">
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 lg:mb-10 gap-2 lg:gap-4">
              <div>
                <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-2 lg:mb-3">
                  Handpicked Selection
                </h2>
                <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
                  Featured Products
                </h1>
              </div>
            </div>

            <FeaturedProductsGrid products={featuredProducts} pageSize={10} />
          </>
        )}

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 md:my-12 lg:my-16">
          {/* Products Catalog Card */}
          <Link
            href="/products"
            className="group bg-gradient-to-br from-secondary to-gray-50 rounded-3xl p-8 text-primary hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mb-4">
                <ShoppingBag size={32} className="text-accent" />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">
                Shop Products
              </h3>
              <p className="text-text-dark/70 text-sm mb-4 leading-relaxed">
                Browse our complete catalog of premium products and exclusive
                items.
              </p>
              <div className="flex items-center gap-2 text-accent font-bold text-sm group-hover:gap-4 transition-all">
                View All Products
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Wholesale Card */}
          <Link
            href="/wholesale"
            className="group bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mb-4">
                <Package size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">
                Wholesale
              </h3>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">
                Bulk orders with exclusive pricing for retailers and business
                partners.
              </p>
              <div className="flex items-center gap-2 text-accent font-bold text-sm group-hover:gap-4 transition-all">
                Explore Wholesale
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* VIP Store Card */}
          <Link
            href="/vip-store"
            className="group bg-gradient-to-br from-accent via-accent/90 to-primary rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mb-4">
                <Crown size={32} className="text-accent" />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">
                VIP Store
              </h3>
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                Exclusive service for custom orders and personalized shopping.
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-4 transition-all">
                Enter VIP Store
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-8 md:p-10 lg:p-12 text-white text-center mt-8 lg:mt-16">
          <h3 className="text-3xl font-black mb-4">
            Ready to Experience Luxury?
          </h3>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join our exclusive community of customers who appreciate the finest
            things in life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-accent text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-primary transition-all shadow-lg"
            >
              Browse Collection
            </Link>
            <Link
              href="/vip-store"
              className="bg-white text-primary px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-lg"
            >
              Contact VIP Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

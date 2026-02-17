import { Product } from "@/types";
import db from "@/utils/db";
import ProductModel from "@/models/Product";
import { MongoDocument } from "@/utils/db";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedProductsGrid from "@/components/FeaturedProductsGrid";

export default async function Home() {
  await db.connect();

  const featuredDocs = await ProductModel.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .lean();

  const featuredProducts = featuredDocs.map(
    (doc) => db.convertDocToObj(doc as MongoDocument) as unknown as Product,
  );

  const heroSlides = [
    {
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
      alt: "Collection Printemps",
      title: "Le Hub de la Mode & du Luxe",
      subtitle: "B2C  ·  Wholesale  ·  Production Sur Mesure",
      description: "Achetez, Commandez, Produisez en toute simplicité",
    },
    {
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
      alt: "Collection Luxe",
      title: "Nouvelles Arrivées",
      subtitle: "Collection Printemps 2026",
      description:
        "Soyez les premiers à découvrir notre dernière collection avec des créations exclusives.",
    },
    {
      type: "image" as const,
      src: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070",
      alt: "VIP Exclusif",
      title: "Accès VIP Exclusif",
      subtitle: "Membres Uniquement",
      description:
        "Rejoignez notre programme VIP pour un accès exclusif aux éditions limitées et au stylisme personnalisé.",
    },
    {
      type: "video" as const,
      src: "https://cdn.coverr.co/videos/coverr-elegant-woman-in-a-luxurious-outfit-4571/1080p.mp4",
      alt: "Vidéo Mode Luxe",
      title: "L'Élégance en Mouvement",
      subtitle: "Casa di Moda — Hiver 2026",
      description:
        "Plongez dans l'univers de la haute couture avec un savoir-faire exceptionnel et un design intemporel.",
    },
  ];

  return (
    <div>
      {/* Full-width Hero Carousel with category cards inside */}
      <HeroCarousel slides={heroSlides} autoplayInterval={5000} />

      {/* Brand Statement Section - Dark with side-by-side fashion images */}
      <div className="bg-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          {/* Two fashion images side by side */}
          <div className="grid grid-cols-2 gap-3 md:gap-5 mb-8 md:mb-12">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200"
                alt="Collection Femme"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200"
                alt="Collection Homme"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Brand text centered */}
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white tracking-wider mb-3 md:mb-4">
              CASA DI MODA
            </h2>
            <p className="text-white/50 uppercase tracking-[0.4em] text-[10px] md:text-sm font-medium">
              Curate. Create. Connect.
            </p>
          </div>
        </div>
      </div>

      {/* 2x2 Service Grid Section - Dark */}
      <div className="bg-[#2a2a2a] pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Shop B2C */}
            <Link
              href="/products"
              className="group block relative aspect-[16/9] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"
                alt="Shop B2C"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3 md:px-5 md:py-4">
                <p className="text-white/90 uppercase tracking-wider text-[10px] md:text-xs font-bold">
                  Shop B2C —{" "}
                  <span className="text-white/50 font-normal">
                    Discover Luxury Brands
                  </span>
                </p>
              </div>
            </Link>

            {/* Wholesale B2B */}
            <Link
              href="/wholesale"
              className="group block relative aspect-[16/9] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=1200"
                alt="Wholesale B2B"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3 md:px-5 md:py-4">
                <p className="text-white/90 uppercase tracking-wider text-[10px] md:text-xs font-bold">
                  Wholesale B2B —{" "}
                  <span className="text-white/50 font-normal">
                    Premium Fabrics & Supplies
                  </span>
                </p>
              </div>
            </Link>

            {/* VIP Store */}
            <Link
              href="/vip-store"
              className="group block relative aspect-[16/9] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
                alt="VIP Store"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3 md:px-5 md:py-4">
                <p className="text-white/90 uppercase tracking-wider text-[10px] md:text-xs font-bold">
                  VIP Store —{" "}
                  <span className="text-white/50 font-normal">
                    Bespoke Design on Demand
                  </span>
                </p>
              </div>
            </Link>

            {/* Become a Partner */}
            <Link
              href="/become-supplier"
              className="group block relative aspect-[16/9] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200"
                alt="Become a Partner"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3 md:px-5 md:py-4">
                <p className="text-white/90 uppercase tracking-wider text-[10px] md:text-xs font-bold">
                  Become a Partner —{" "}
                  <span className="text-white/50 font-normal">
                    Join Our Network
                  </span>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Découvrez Nos Univers - Dark Section */}
      <div className="bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              <div className="h-px flex-1 bg-accent/50" />
              <h2 className="font-serif text-2xl md:text-4xl text-white italic whitespace-nowrap">
                Découvrez Nos Univers
              </h2>
              <div className="h-px flex-1 bg-accent/50" />
            </div>
            <div className="h-px w-full bg-accent/30 mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Link
              href="/products"
              className="group block border border-accent/30 hover:border-accent/60 transition-all duration-500 overflow-hidden bg-primary/80"
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"
                  alt="Boutique B2C"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-5 text-center border-t border-accent/20">
                <h3 className="font-serif text-lg md:text-xl text-white mb-1 italic">
                  Boutique B2C
                </h3>
                <p className="text-white/40 text-[10px] md:text-xs tracking-wider">
                  Mode & Accessoires
                </p>
              </div>
            </Link>

            <Link
              href="/wholesale"
              className="group block border border-accent/30 hover:border-accent/60 transition-all duration-500 overflow-hidden bg-primary/80"
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=1200"
                  alt="Wholesale B2B"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-5 text-center border-t border-accent/20">
                <h3 className="font-serif text-lg md:text-xl text-white mb-1 italic">
                  Wholesale B2B
                </h3>
                <p className="text-white/40 text-[10px] md:text-xs tracking-wider">
                  Vente en Gros
                </p>
              </div>
            </Link>

            <Link
              href="/vip-store"
              className="group block border border-accent/30 hover:border-accent/60 transition-all duration-500 overflow-hidden bg-primary/80"
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
                  alt="VIP Store"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-5 text-center border-t border-accent/20">
                <h3 className="font-serif text-lg md:text-xl text-white mb-1 italic">
                  VIP Store
                </h3>
                <p className="text-white/40 text-[10px] md:text-xs tracking-wider">
                  Création Sur Commande
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="bg-[#2a2a2a]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-accent font-medium uppercase tracking-[0.4em] text-[10px] md:text-xs mb-3">
                Sélection Exclusive
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-white italic">
                Produits en Vedette
              </h2>
              <div className="w-16 h-[2px] bg-accent mx-auto mt-4" />
            </div>

            <FeaturedProductsGrid products={featuredProducts} pageSize={10} />
          </div>
        </div>
      )}

      {/* Bottom CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
          <p className="text-accent font-medium uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4">
            Casa di Moda
          </p>
          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 italic">
            Prêt à Vivre le Luxe ?
          </h3>
          <p className="text-white/50 mb-8 md:mb-10 max-w-xl mx-auto text-sm md:text-base">
            Rejoignez notre communauté exclusive de clients qui apprécient les
            plus belles choses de la vie.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/products"
              className="bg-accent text-white px-8 md:px-10 py-3 md:py-4 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-white hover:text-primary transition-all"
            >
              Parcourir la Collection
            </Link>
            <Link
              href="/vip-store"
              className="border border-white/30 text-white px-8 md:px-10 py-3 md:py-4 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-white hover:text-primary transition-all"
            >
              Contacter l&apos;Équipe VIP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

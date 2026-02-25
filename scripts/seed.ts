/**
 * Casa Di Moda — Seed Script
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/seed.ts
 *   OR
 *   npx tsx scripts/seed.ts
 *
 * Creates:
 *  - 1 admin user
 *  - 1 supplier user + supplier profile
 *  - 1 customer user
 *  - Categories & subcategories
 *  - 4 admin products (2 detail + 2 gros)
 *  - 4 supplier products (2 detail + 2 gros)
 *  - 1 order for the customer (1 detail item + 1 gros item)
 */

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" }); // fallback

// ─── Models ──────────────────────────────────────────────────────────────────
import User from "../models/User";
import Supplier from "../models/Supplier";
import Product from "../models/Product";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import Brand from "../models/Brand";
import Order from "../models/Order";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not found in .env.local");

// ─── Helpers ─────────────────────────────────────────────────────────────────
const hash = (pw: string) => bcryptjs.hashSync(pw, 10);

// ─── Seed Data ────────────────────────────────────────────────────────────────

// parentCategory visual identifiers (detail = B2C retail, gros = B2B wholesale)
// These map to Product.parentCategory enum — not a separate collection,
// but represented via category images tagged below.

const categories = [
  {
    name: "Vêtements",
    slug: "vetements",
    description: "Mode et prêt-à-porter de luxe",
    // A rack of elegant clothing in a luxury boutique
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop",
  },
  {
    name: "Chaussures",
    slug: "chaussures",
    description: "Chaussures de luxe et sneakers premium",
    // Luxury shoe shelf with heels and sneakers
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop",
  },
  {
    name: "Accessoires",
    slug: "accessoires",
    description: "Sacs, montres, bijoux & accessoires haut de gamme",
    // Luxury handbag flat-lay with watch and jewellery
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop",
  },
];

const subCategories = [
  {
    name: "Robes & Tenues",
    slug: "robes-tenues",
    parentCategory: "Vêtements",
    description: "Robes de soirée, tenues cocktail et prêt-à-porter",
    // Elegant evening dresses on mannequins
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=600&fit=crop",
  },
  {
    name: "Manteaux & Vestes",
    slug: "manteaux-vestes",
    parentCategory: "Vêtements",
    description: "Vestes en cuir, blazers et manteaux de saison",
    // Leather jacket close-up on model
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop",
  },
  {
    name: "Sneakers",
    slug: "sneakers",
    parentCategory: "Chaussures",
    description: "Sneakers de luxe et éditions limitées",
    // White sneakers on clean background
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
  },
  {
    name: "Escarpins",
    slug: "escarpins",
    parentCategory: "Chaussures",
    description: "Escarpins et chaussures de soirée",
    // Elegant heels on studio background
    image:
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&h=600&fit=crop",
  },
  {
    name: "Sacs à Main",
    slug: "sacs-main",
    parentCategory: "Accessoires",
    description: "Sacs de luxe, pochettes et maroquinerie",
    // Luxury handbag on marble surface
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop",
  },
  {
    name: "Montres",
    slug: "montres",
    parentCategory: "Accessoires",
    description: "Montres de prestige et horlogerie fine",
    // Watch on dark background showing dial
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
  },
];

const brands = [
  {
    name: "Versace",
    slug: "versace",
    description:
      "Maison de couture italienne fondée en 1978, symbole d'audace et de luxe baroque.",
    // Versace-style gold baroque pattern / fashion editorial
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  },
  {
    name: "Hermès",
    slug: "hermes",
    description:
      "Maison française de luxe fondée en 1837, artisanat d'exception et intemporalité.",
    // Orange luxury box / leather goods flat-lay
    logo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
  },
  {
    name: "Balenciaga",
    slug: "balenciaga",
    description:
      "Label de mode de luxe espagnol, avant-garde du streetwear haut de gamme.",
    // Triple S sneaker white close-up
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    name: "Rolex",
    slug: "rolex",
    description:
      "Manufacture horlogère suisse de prestige, référence mondiale du luxe.",
    // Submariner dial close-up
    logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    name: "Casa Di Moda Wholesale",
    slug: "casa-di-moda-wholesale",
    description:
      "Marque maison pour les collections wholesale B2B Casa Di Moda.",
    // Fashion boutique interior
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
  },
  {
    name: "LuxLeather Co.",
    slug: "luxleather-co",
    description: "Spécialiste du cuir premium pour la revente professionnelle.",
    // Leather texture close-up
    logo: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
  },
  {
    name: "SportLine Pro",
    slug: "sportline-pro",
    description:
      "Equipementier sport premium pour distributeurs et boutiques spécialisées.",
    // Running shoes on track
    logo: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
  },
];

// ─── Admin Products (2 detail + 2 gros) ──────────────────────────────────────
const adminProducts = [
  // ── DETAIL ──
  {
    name: "Robe de Soirée Versace Noire",
    slug: "robe-soiree-versace-noire",
    category: "Vêtements",
    subCategory: "Robes & Tenues",
    brand: "Versace",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
    price: 3200,
    discountPrice: 2890,
    countInStock: 12,
    description:
      "Robe de soirée Versace en crêpe de soie, coupe ajustée avec décolleté en V plongeant. Ornée d'une fermeture dorée signature. Parfaite pour les grandes occasions.",
    rating: 4.8,
    numReviews: 34,
    deliveryTime: "3-5 jours",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Noir", "Rouge Bordeaux"],
    colorImages: [
      {
        color: "Noir",
        // Model in elegant black evening gown
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
      },
      {
        color: "Rouge Bordeaux",
        // Model in deep red evening dress
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "detail",
    isFeatured: true,
    addedBy: "admin",
    approvalStatus: "approved",
  },
  {
    name: "Sac Hermès Birkin 30 Togo",
    slug: "sac-hermes-birkin-30-togo",
    category: "Accessoires",
    subCategory: "Sacs à Main",
    brand: "Hermès",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop",
    price: 12500,
    discountPrice: 0,
    countInStock: 4,
    description:
      "Sac Hermès Birkin 30 en cuir Togo grainé. Fermeture tourniquets dorés, double poignée. Livré avec cadenas, clés et tirette. Pièce d'exception intemporelle.",
    rating: 5.0,
    numReviews: 18,
    deliveryTime: "5-7 jours",
    dimensions: "30 × 22 × 16 cm",
    weight: "1.1 kg",
    sizes: ["30cm"],
    colors: ["Fauve", "Noir", "Étoupe"],
    colorImages: [
      {
        color: "Fauve",
        // Model carrying tan/caramel Birkin
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop",
      },
      {
        color: "Noir",
        // Model with black luxury handbag
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop",
      },
      {
        color: "Étoupe",
        // Model with taupe/greige structured bag
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "detail",
    isFeatured: true,
    addedBy: "admin",
    approvalStatus: "approved",
  },

  // ── GROS ──
  {
    name: "Lot 12 T-Shirts Premium Essentials",
    slug: "lot-12-tshirts-premium-essentials",
    category: "Vêtements",
    subCategory: "Robes & Tenues",
    brand: "Casa Di Moda Wholesale",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
    price: 1440,
    discountPrice: 1200,
    countInStock: 80,
    description:
      "Lot de 12 t-shirts premium en coton pima 200g/m². Coupe regular fit, col rond renforcé. Idéal pour la revente boutique. Minimum de commande: 1 lot (12 pièces).",
    rating: 4.5,
    numReviews: 62,
    deliveryTime: "7-10 jours",
    weight: "2.4 kg / lot",
    cbm: 0.02,
    hsCode: "6109.10.00",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blanc", "Noir", "Gris Chiné", "Marine"],
    colorImages: [
      {
        color: "Blanc",
        // Model wearing white t-shirt
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
      },
      {
        color: "Noir",
        // Model wearing black t-shirt
        image:
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop",
      },
      {
        color: "Gris Chiné",
        // Model wearing grey marl t-shirt
        image:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop",
      },
      {
        color: "Marine",
        // Model wearing navy blue t-shirt
        image:
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "gros",
    isFeatured: false,
    addedBy: "admin",
    approvalStatus: "approved",
  },
  {
    name: "Collection Écharpes Soie 100% — Lot 6",
    slug: "collection-echarpes-soie-lot-6",
    category: "Accessoires",
    subCategory: "Sacs à Main",
    brand: "Casa Di Moda Wholesale",
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=1000&fit=crop",
    price: 780,
    discountPrice: 650,
    countInStock: 50,
    description:
      "Lot de 6 écharpes en soie naturelle 100% (twill 16 momme), format carré 90×90 cm. Impression numérique haute définition, motifs exclusifs Casa Di Moda. Parfait pour boutiques multi-marques.",
    rating: 4.7,
    numReviews: 29,
    deliveryTime: "7-14 jours",
    dimensions: "90 × 90 cm",
    weight: "0.6 kg / lot",
    cbm: 0.005,
    hsCode: "6214.10.00",
    sizes: ["90×90 cm"],
    colors: ["Bleu Nuit", "Rouge Carmin", "Vert Émeraude", "Or & Ivoire"],
    colorImages: [
      {
        color: "Bleu Nuit",
        // Model wearing navy blue silk scarf
        image:
          "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=1000&fit=crop",
      },
      {
        color: "Rouge Carmin",
        // Model with crimson red silk scarf
        image:
          "https://images.unsplash.com/photo-1609803384069-19f3f1d2040b?w=800&h=1000&fit=crop",
      },
      {
        color: "Vert Émeraude",
        // Model with emerald green scarf
        image:
          "https://images.unsplash.com/photo-1543087903-1ac2364a7858?w=800&h=1000&fit=crop",
      },
      {
        color: "Or & Ivoire",
        // Model with gold and ivory patterned scarf
        image:
          "https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "gros",
    isFeatured: false,
    addedBy: "admin",
    approvalStatus: "approved",
  },
];

// ─── Supplier Products (2 detail + 2 gros) ───────────────────────────────────
const supplierProductsData = [
  // ── DETAIL ──
  {
    name: "Sneakers Balenciaga Triple S Blanches",
    slug: "sneakers-balenciaga-triple-s-blanches",
    category: "Chaussures",
    subCategory: "Sneakers",
    brand: "Balenciaga",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop",
    price: 950,
    discountPrice: 820,
    countInStock: 20,
    description:
      "Balenciaga Triple S, semelle triple densité emblématique, tige en mesh et cuir vieilli. Look oversized streetwear de haute couture. Authentification garantie.",
    rating: 4.6,
    numReviews: 47,
    deliveryTime: "2-4 jours",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["Blanc Total", "Blanc / Gris", "Noir"],
    colorImages: [
      {
        color: "Blanc Total",
        // Model wearing all-white Triple S
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop",
      },
      {
        color: "Blanc / Gris",
        // Model wearing white/grey colorway sneakers
        image:
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=1000&fit=crop",
      },
      {
        color: "Noir",
        // Model wearing black chunky sneakers
        image:
          "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "detail",
    isFeatured: true,
    addedBy: "supplier",
    approvalStatus: "approved",
  },
  {
    name: "Montre Rolex Submariner Date Acier",
    slug: "montre-rolex-submariner-date-acier",
    category: "Accessoires",
    subCategory: "Montres",
    brand: "Rolex",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop",
    price: 18500,
    discountPrice: 0,
    countInStock: 3,
    description:
      "Rolex Submariner Date ref. 126610LN, boîtier 41mm Oystersteel, cadran et lunette noirs, bracelet Oyster. Étanchéité 300m, mouvement automatique calibre 3235. Avec boîte et papers.",
    rating: 5.0,
    numReviews: 11,
    deliveryTime: "3-5 jours",
    dimensions: "41mm",
    weight: "155 g",
    sizes: ["41mm"],
    colors: ["Noir / Argent"],
    colorImages: [
      {
        color: "Noir / Argent",
        // Model wearing Submariner on wrist
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "detail",
    isFeatured: true,
    addedBy: "supplier",
    approvalStatus: "approved",
  },

  // ── GROS ──
  {
    name: "Lot Vestes Cuir Agneau Premium — 8 pièces",
    slug: "lot-vestes-cuir-agneau-premium-8-pieces",
    category: "Vêtements",
    subCategory: "Manteaux & Vestes",
    brand: "LuxLeather Co.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
    price: 4800,
    discountPrice: 4200,
    countInStock: 30,
    description:
      "Lot de 8 vestes en cuir d'agneau pleine fleur, doublure en satin, fermeture YKK. Coupe biker premium. Tailles mixtes S-XL (2 par taille). Idéal détaillants mode cuir.",
    rating: 4.4,
    numReviews: 21,
    deliveryTime: "10-14 jours",
    weight: "8 kg / lot",
    cbm: 0.06,
    hsCode: "4203.10.00",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Noir", "Marron Cognac"],
    colorImages: [
      {
        color: "Noir",
        // Model wearing black biker leather jacket
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
      },
      {
        color: "Marron Cognac",
        // Model wearing cognac brown leather jacket
        image:
          "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "gros",
    isFeatured: false,
    addedBy: "supplier",
    approvalStatus: "approved",
  },
  {
    name: "Lot Sneakers Running Sport — 24 paires",
    slug: "lot-sneakers-running-sport-24-paires",
    category: "Chaussures",
    subCategory: "Sneakers",
    brand: "SportLine Pro",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=1000&fit=crop",
    price: 2880,
    discountPrice: 2400,
    countInStock: 45,
    description:
      "Lot de 24 paires de sneakers running, semelle EVA ultra-légère, tige mesh respirante, technologie amorti gel. Pointures 37-44 (3 paires / pointure). Pour boutiques sport & bien-être.",
    rating: 4.3,
    numReviews: 38,
    deliveryTime: "7-12 jours",
    weight: "12 kg / lot",
    cbm: 0.18,
    hsCode: "6404.11.00",
    sizes: ["37", "38", "39", "40", "41", "42", "43", "44"],
    colors: ["Blanc / Bleu", "Noir / Rouge", "Gris / Jaune"],
    colorImages: [
      {
        color: "Blanc / Bleu",
        // Model wearing white/blue running shoes
        image:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=1000&fit=crop",
      },
      {
        color: "Noir / Rouge",
        // Model wearing black/red sport sneakers
        image:
          "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=1000&fit=crop",
      },
      {
        color: "Gris / Jaune",
        // Model wearing grey/yellow running shoes
        image:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop",
      },
    ],
    parentCategory: "gros",
    isFeatured: false,
    addedBy: "supplier",
    approvalStatus: "approved",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // ── 1. Users ──────────────────────────────────────────────────────────────
  console.log("\n👤 Creating users...");

  await User.deleteMany({
    email: {
      $in: [
        "admin@casadimoda.com",
        "supplier@casadimoda.com",
        "client@casadimoda.com",
      ],
    },
  });

  const adminUser = await User.create({
    name: "Casa Admin",
    email: "admin@casadimoda.com",
    password: hash("admin123"),
    isAdmin: true,
    role: "admin",
  });
  console.log("   Admin:", adminUser.email);

  const supplierUser = await User.create({
    name: "Luxe Fournisseur",
    email: "supplier@casadimoda.com",
    password: hash("supplier123"),
    isAdmin: false,
    role: "supplier",
  });
  console.log("   Supplier user:", supplierUser.email);

  const customerUser = await User.create({
    name: "Sophie Martin",
    email: "client@casadimoda.com",
    password: hash("client123"),
    isAdmin: false,
    role: "customer",
  });
  console.log("   Customer:", customerUser.email);

  // ── 2. Supplier Profile ───────────────────────────────────────────────────
  console.log("\n🏪 Creating supplier profile...");

  await Supplier.deleteMany({
    $or: [
      { user: supplierUser._id },
      { businessSlug: "luxe-mode-international" },
    ],
  });

  const supplierProfile = await Supplier.create({
    user: supplierUser._id,
    businessName: "Luxe Mode International",
    businessSlug: "luxe-mode-international",
    businessDescription:
      "Fournisseur premium de prêt-à-porter et accessoires de luxe. Spécialisé dans les marques haut de gamme et le wholesale B2B.",
    businessLogo:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    contactPhone: "+216 71 000 111",
    contactEmail: "supplier@casadimoda.com",
    address: {
      street: "12 Avenue de la Mode",
      city: "Tunis",
      postalCode: "1002",
      country: "Tunisie",
    },
    status: "approved",
    approvedAt: new Date(),
    approvedBy: adminUser._id,
    commissionRate: 15,
  });

  // Link supplier to user
  await User.findByIdAndUpdate(supplierUser._id, {
    supplierId: supplierProfile._id,
  });
  console.log("   Supplier profile:", supplierProfile.businessName);

  // ── 3. Categories, SubCategories & Brands ────────────────────────────────
  console.log("\n📂 Creating categories, subcategories & brands...");

  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, {
      upsert: true,
      new: true,
    });
  }
  console.log(`   ${categories.length} categories upserted`);

  for (const sub of subCategories) {
    await SubCategory.findOneAndUpdate({ slug: sub.slug }, sub, {
      upsert: true,
      new: true,
    });
  }
  console.log(`   ${subCategories.length} subcategories upserted`);

  for (const brand of brands) {
    await Brand.findOneAndUpdate({ slug: brand.slug }, brand, {
      upsert: true,
      new: true,
    });
  }
  console.log(`   ${brands.length} brands upserted`);

  // ── 4. Admin Products ─────────────────────────────────────────────────────
  console.log("\n📦 Creating admin products...");

  await Product.deleteMany({ slug: { $in: adminProducts.map((p) => p.slug) } });

  const createdAdminProducts = await Product.insertMany(
    adminProducts.map((p) => ({ ...p, supplier: null })),
  );
  createdAdminProducts.forEach((p) =>
    console.log(`   [${p.parentCategory.toUpperCase()}] ${p.name}`),
  );

  // ── 5. Supplier Products ──────────────────────────────────────────────────
  console.log("\n📦 Creating supplier products...");

  await Product.deleteMany({
    slug: { $in: supplierProductsData.map((p) => p.slug) },
  });

  const createdSupplierProducts = await Product.insertMany(
    supplierProductsData.map((p) => ({ ...p, supplier: supplierProfile._id })),
  );
  createdSupplierProducts.forEach((p) =>
    console.log(`   [${p.parentCategory.toUpperCase()}] ${p.name}`),
  );

  // ── 6. Customer Order ─────────────────────────────────────────────────────
  console.log("\n🛒 Creating customer order...");

  // Pick 1 detail product + 1 gros product (from admin products for simplicity)
  const detailProduct = createdAdminProducts.find(
    (p) => p.parentCategory === "detail",
  )!;
  const grosProduct = createdAdminProducts.find(
    (p) => p.parentCategory === "gros",
  )!;

  await Order.deleteMany({ user: customerUser._id });

  const itemsPrice =
    (detailProduct.discountPrice || detailProduct.price) +
    (grosProduct.discountPrice || grosProduct.price);
  const shippingPrice = 0;
  const taxPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: customerUser._id,
    orderItems: [
      {
        name: detailProduct.name,
        quantity: 1,
        image: detailProduct.image,
        price: detailProduct.discountPrice || detailProduct.price,
      },
      {
        name: grosProduct.name,
        quantity: 1,
        image: grosProduct.image,
        price: grosProduct.discountPrice || grosProduct.price,
      },
    ],
    shippingAddress: {
      fullName: "Sophie Martin",
      address: "45 Rue des Jasmins",
      city: "Tunis",
      postalCode: "2080",
      country: "Tunisie",
    },
    paymentMethod: "Paiement à la livraison",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: false,
    isDelivered: false,
  });

  console.log(`   Order #${order._id} — ${totalPrice.toLocaleString()} TND`);
  console.log(`     • [DETAIL] ${detailProduct.name}`);
  console.log(`     • [GROS]   ${grosProduct.name}`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Seed complete!\n");
  console.log("  Accounts:");
  console.log("    Admin    → admin@casadimoda.com     / admin123");
  console.log("    Supplier → supplier@casadimoda.com  / supplier123");
  console.log("    Customer → client@casadimoda.com    / client123");
  console.log("\n  Products created: 8 total (4 admin + 4 supplier)");
  console.log("    Detail: 4 products  |  Gros: 4 products");
  console.log(
    `\n  Categories: ${categories.length}  |  SubCategories: ${subCategories.length}  |  Brands: ${brands.length}`,
  );
  console.log("\n  Orders created: 1 (for Sophie Martin)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

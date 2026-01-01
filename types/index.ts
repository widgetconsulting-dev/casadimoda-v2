export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  parentCategory: string;
  description: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  isActive: boolean;
}

export interface GiftCard {
  _id: string;
  code: string;
  amount: number;
  balance: number;
  isActive: boolean;
}

export interface CartItem {
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  countInStock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  discountPrice: number;
  countInStock: number;
  image: string;
  description: string;
  subCategory: string;
  rating: number;
  numReviews: number;
  deliveryTime?: string;
  dimensions?: string;
  weight?: string;
  cbm?: number;
  hsCode?: string;
  isFeatured?: boolean;
}

export type CategoryFormData = {
  name: string;
  description: string;
};

export type SubCategoryFormData = {
  name: string;
  parentCategory: string;
  description: string;
};

export type GiftCardFormData = {
  _id: string;
  code: string;
  amount: number;
  balance: number;
  isActive: boolean;
};

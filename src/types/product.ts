export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export type StockStatus = "available" | "low-stock" | "sold-out";

export interface SizeOption {
  value: string;
  stock: number;
  status: StockStatus;
}

export interface ColorVariant {
  name: string;
  hexCode: string;
  images: string[];
  sizes: SizeOption[];
}

export interface ProductVariantData {
  brand: string;
  originalPrice?: number;
  colors: ColorVariant[];
}
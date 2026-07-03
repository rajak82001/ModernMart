import type { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

export interface CartActionPayload {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
}

export type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: CartActionPayload;
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: {
        productId: number;
        selectedColor?: string;
        selectedSize?: string;
      };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: number;
        quantity: number;
        selectedColor?: string;
        selectedSize?: string;
      };
    }
  | {
      type: "TOGGLE_CART";
    };
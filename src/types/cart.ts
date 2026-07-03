import type { Product } from "./product";

export interface CartItem extends Product {
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
}

export type CartAction =
    | {
        type: "ADD_TO_CART";
        payload: Product;
    }
    | {
        type: "REMOVE_FROM_CART";
        payload: number;
    }
    | {
        type: "UPDATE_QUANTITY";
        payload: {
            productId: number;
            quantity: number;
        };
    }
    | {
        type: "TOGGLE_CART";
    };
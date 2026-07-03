import type { CartAction, CartItem, CartState } from "../types/cart";

export const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

const getCartItemKey = (item: CartItem): string =>
  `${item.id}-${item.selectedColor ?? "default"}-${item.selectedSize ?? "default"}`;

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const quantity = action.payload.quantity ?? 1;
      const itemKey = `${action.payload.product.id}-${action.payload.selectedColor ?? "default"}-${action.payload.selectedSize ?? "default"}`;
      const existingItem = state.items.find((item) => getCartItemKey(item) === itemKey);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            getCartItemKey(item) === itemKey
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          ),
        };
      }

      const newItem: CartItem = {
        ...action.payload.product,
        quantity,
        selectedColor: action.payload.selectedColor,
        selectedSize: action.payload.selectedSize,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "REMOVE_FROM_CART": {
      const itemKey = `${action.payload.productId}-${action.payload.selectedColor ?? "default"}-${action.payload.selectedSize ?? "default"}`;

      return {
        ...state,
        items: state.items.filter((item) => getCartItemKey(item) !== itemKey),
      };
    }

    case "UPDATE_QUANTITY": {
      const quantity = Math.max(0, action.payload.quantity);
      const itemKey = `${action.payload.productId}-${action.payload.selectedColor ?? "default"}-${action.payload.selectedSize ?? "default"}`;

      return {
        ...state,
        items: state.items
          .map((item) =>
            getCartItemKey(item) === itemKey
              ? {
                  ...item,
                  quantity,
                }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "TOGGLE_CART":
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };

    default:
      return state;
  }
};
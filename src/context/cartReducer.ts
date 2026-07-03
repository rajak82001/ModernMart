import type {
    CartAction,
    CartItem,
    CartState,
} from "../types/cart";

export const initialState: CartState = {
    items: [],
    isCartOpen: false,
};

export const cartReducer = (
    state: CartState,
    action: CartAction
): CartState => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === action.payload.id
                            ? {
                                ...item,
                                quantity: item.quantity + 1,
                            }
                            : item
                    ),
                };
            }

            const newItem: CartItem = {
                ...action.payload,
                quantity: 1,
            };

            return {
                ...state,
                items: [...state.items, newItem],
            };
        }

        case "REMOVE_FROM_CART":
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.id !== action.payload
                ),
            };

        case "UPDATE_QUANTITY":
            return {
                ...state,
                items: state.items
                    .map((item) =>
                        item.id === action.payload.productId
                            ? {
                                ...item,
                                quantity: Math.max( 
                                    1,
                                    action.payload.quantity
                                ),
                            }
                            : item
                    ),
            };

        case "TOGGLE_CART":
            return {
                ...state,
                isCartOpen: !state.isCartOpen,
            };

        default:
            return state;
    }
};
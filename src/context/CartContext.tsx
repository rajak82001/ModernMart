import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

import {
  cartReducer,
  initialState,
} from "./cartReducer";

import type {
  CartAction,
  CartState,
} from "../types/cart";

interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
}

export const CartContext =
  createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState
  );

  return (
    <CartContext.Provider
      value={{ state, dispatch }}
    >
      {children}
    </CartContext.Provider>
  );
};
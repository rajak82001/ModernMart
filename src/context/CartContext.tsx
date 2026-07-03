import {
  createContext,
  useEffect,
  useMemo,
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

const getInitialState = (): CartState => {
  try {
    const storedCart = localStorage.getItem("cart");

    return storedCart
      ? {
          ...initialState,
          items: JSON.parse(storedCart),
        }
      : initialState;
  } catch {
    return initialState;
  }
};

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    getInitialState,
  );

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(state.items),
    );
  }, [state.items]);

  const value = useMemo(
    () => ({ state, dispatch }),
    [state]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
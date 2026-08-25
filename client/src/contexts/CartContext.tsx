import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type CartPlan = { title: string; price: string; note: string };

type CartContextValue = {
  items: CartPlan[];
  add: (item: CartPlan) => void;
  remove: (title: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartPlan[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const value = useMemo<CartContextValue>(() => ({
    items,
    add: (item) => setItems((current) => current.some((entry) => entry.title === item.title) ? current : [...current, item]),
    remove: (title) => setItems((current) => current.filter((entry) => entry.title !== title)),
    clear: () => setItems([]),
    cartOpen,
    setCartOpen,
  }), [items, cartOpen]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}

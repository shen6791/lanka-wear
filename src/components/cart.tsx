"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  variantId: number;
  slug: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string | null;
  qty: number;
  max: number;
};

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (variantId: number, qty: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "lw-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.variantId === item.variantId);
      if (found) return cur.map((i) => (i.variantId === item.variantId ? { ...i, max: item.max, qty: Math.min(i.qty + qty, item.max) } : i));
      return [...cur, { ...item, qty: Math.min(qty, item.max) }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback(
    (variantId: number, qty: number) =>
      setItems((cur) => cur.map((i) => (i.variantId === variantId ? { ...i, qty: Math.max(1, Math.min(qty, i.max)) } : i))),
    [],
  );
  const remove = useCallback((variantId: number) => setItems((cur) => cur.filter((i) => i.variantId !== variantId)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Ctx>(
    () => ({
      items,
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: items.reduce((a, i) => a + i.qty * i.price, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [items, open, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

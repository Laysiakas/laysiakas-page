"use client";
import React, { createContext, useContext, useState } from "react";

type CartItem = {
  sku: string;
  title: string;
  price: number;
  size: string;
  qty: number;
  image: string;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeOne: (sku: string, size: string) => void;
  removeLine: (sku: string, size: string) => void;
  hasItem: (sku: string, size: string) => boolean;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.sku === item.sku && x.size === item.size);
      if (i > -1) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeOne = (sku: string, size: string) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.sku === sku && x.size === size);
      if (i === -1) return prev;
      const copy = [...prev];
      if (copy[i].qty > 1) {
        copy[i] = { ...copy[i], qty: copy[i].qty - 1 };
        return copy;
      }
      copy.splice(i, 1);
      return copy;
    });
  };

  const removeLine = (sku: string, size: string) => {
    setItems((prev) => prev.filter((x) => !(x.sku === sku && x.size === size)));
  };

  const hasItem = (sku: string, size: string) =>
    items.some((x) => x.sku === sku && x.size === size);

  const clear = () => setItems([]);

  return (
    <Ctx.Provider value={{ items, addItem, removeOne, removeLine, hasItem, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}

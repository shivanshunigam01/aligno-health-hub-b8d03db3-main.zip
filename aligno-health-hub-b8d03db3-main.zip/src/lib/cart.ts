import { create } from "zustand";
import { persist } from "zustand/middleware";
import { productService } from "./store";
import type { CartItem, Product } from "./types";

interface CartState {
  items: CartItem[];
  wishlist: string[];
  coupon: string | null;
  add: (productId: string, qty?: number, size?: string) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  toggleWish: (productId: string) => void;
  setCoupon: (c: string | null) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      coupon: null,
      add: (productId, qty = 1, size) =>
        set((s) => {
          const ex = s.items.find((i) => i.productId === productId && i.size === size);
          if (ex) return { items: s.items.map((i) => (i === ex ? { ...i, qty: i.qty + qty } : i)) };
          return { items: [...s.items, { productId, qty, size }] };
        }),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({ items: s.items.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)) })),
      clear: () => set({ items: [], coupon: null }),
      toggleWish: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId) ? s.wishlist.filter((id) => id !== productId) : [...s.wishlist, productId],
        })),
      setCoupon: (c) => set({ coupon: c }),
    }),
    { name: "aligno_cart" },
  ),
);

export function computeCart() {
  const { items, coupon } = useCart.getState();
  const products = productService.list();
  const rows = items
    .map((i) => {
      const p = products.find((x) => x.id === i.productId);
      if (!p) return null;
      return { ...i, product: p as Product, line: p.discountPrice * i.qty };
    })
    .filter(Boolean) as { productId: string; qty: number; size?: string; product: Product; line: number }[];
  const subtotal = rows.reduce((s, r) => s + r.line, 0);
  const discount = coupon === "ALIGNO10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 ? 0 : subtotal - discount >= 999 ? 0 : 79;
  const gst = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + gst;
  return { rows, subtotal, discount, shipping, gst, total };
}

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
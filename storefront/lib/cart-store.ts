"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, BUNDLES, SAMPLE_KIT_PRICE, FREE_SHIP_THRESHOLD, SHIPPING_CHARGE, PROMO_CODES, SUB_RATE, productByHandle, bundleValue } from "./catalog";

export type CartItemType = "product" | "bundle" | "sample-kit" | "gift-card";

export interface CartItem {
  id: string;             // product handle, bundle id, "sample-kit", or "gift-card:<ts>"
  type: CartItemType;
  qty: number;
  subFreq?: string;       // subscription frequency if subscribed
  gift?: {                // only for gift-card items
    amount: number;       // paisa
    to: string;
    toEmail: string;
    from: string;
    msg: string;
    date: string;
    design: string;
  };
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  redeemedGiftCode: string;
  redeemedGiftAmount: number;    // paisa

  // actions
  addProduct: (handle: string, qty?: number) => void;
  addBundle: (id: string) => void;
  addSampleKit: () => void;
  addGiftCard: (gift: CartItem["gift"]) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleSubscribe: (id: string, freq?: string) => void;
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
  redeemGiftCard: (code: string) => string | null;
  removeGiftRedemption: () => void;
  clearCart: () => void;

  // computed (as functions so they're not stale)
  count: () => number;
  subtotal: () => number;
  subSavings: () => number;
  couponDiscount: () => number;
  couponFreeShip: () => boolean;
  shipping: () => number;
  total: () => number;
  hasPhysicalItems: () => boolean;
}

const GIFT_CARD_STORE_KEY = "cafefiro_giftcards_v1";

function loadGiftCards(): Record<string, { balance: number }> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(GIFT_CARD_STORE_KEY) || "{}"); } catch { return {}; }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      redeemedGiftCode: "",
      redeemedGiftAmount: 0,

      addProduct(handle, qty = 1) {
        set((s) => {
          const existing = s.items.find((i) => i.id === handle && i.type === "product");
          if (existing) {
            return { items: s.items.map((i) => i.id === handle && i.type === "product" ? { ...i, qty: i.qty + qty } : i) };
          }
          return { items: [...s.items, { id: handle, type: "product", qty }] };
        });
      },

      addBundle(id) {
        set((s) => {
          const existing = s.items.find((i) => i.id === id && i.type === "bundle");
          if (existing) return { items: s.items.map((i) => i.id === id && i.type === "bundle" ? { ...i, qty: i.qty + 1 } : i) };
          return { items: [...s.items, { id, type: "bundle", qty: 1 }] };
        });
      },

      addSampleKit() {
        set((s) => {
          if (s.items.find((i) => i.id === "sample-kit")) return s;
          return { items: [...s.items, { id: "sample-kit", type: "sample-kit", qty: 1 }] };
        });
      },

      addGiftCard(gift) {
        const id = `gift-card:${Date.now()}`;
        set((s) => ({ items: [...s.items, { id, type: "gift-card", qty: 1, gift }] }));
      },

      removeItem(id) {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
      },

      updateQty(id, qty) {
        if (qty < 1) { get().removeItem(id); return; }
        set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, qty } : i) }));
      },

      toggleSubscribe(id, freq = "1m") {
        set((s) => ({
          items: s.items.map((i) => {
            if (i.id !== id || i.type !== "product") return i;
            return i.subFreq ? { ...i, subFreq: undefined } : { ...i, subFreq: freq };
          }),
        }));
      },

      applyCoupon(code) {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (!promo) return "Invalid coupon code";
        const sub = get().subtotal();
        if (sub < promo.min) return `Minimum order ₹${promo.min / 100} required`;
        set({ couponCode: code.toUpperCase() });
        return null;
      },

      removeCoupon() { set({ couponCode: "" }); },

      redeemGiftCard(code) {
        const cards = loadGiftCards();
        const card = cards[code.toUpperCase()];
        if (!card || card.balance <= 0) return "Invalid or used gift card";
        set({ redeemedGiftCode: code.toUpperCase(), redeemedGiftAmount: card.balance });
        return null;
      },

      removeGiftRedemption() { set({ redeemedGiftCode: "", redeemedGiftAmount: 0 }); },

      clearCart() { set({ items: [], couponCode: "", redeemedGiftCode: "", redeemedGiftAmount: 0 }); },

      count() { return get().items.reduce((s, i) => s + i.qty, 0); },

      subtotal() {
        return get().items.reduce((sum, item) => {
          if (item.type === "product") {
            const p = productByHandle(item.id);
            if (!p) return sum;
            const base = p.price * item.qty;
            return sum + (item.subFreq ? Math.round(base * (1 - SUB_RATE)) : base);
          }
          if (item.type === "bundle") {
            const b = BUNDLES.find((x) => x.id === item.id);
            return sum + (b ? b.price * item.qty : 0);
          }
          if (item.type === "sample-kit") return sum + SAMPLE_KIT_PRICE;
          if (item.type === "gift-card") return sum + (item.gift?.amount ?? 0) * item.qty;
          return sum;
        }, 0);
      },

      subSavings() {
        return get().items.reduce((sum, item) => {
          if (item.type !== "product" || !item.subFreq) return sum;
          const p = productByHandle(item.id);
          if (!p) return sum;
          return sum + Math.round(p.price * item.qty * SUB_RATE);
        }, 0);
      },

      couponDiscount() {
        const code = get().couponCode;
        if (!code) return 0;
        const promo = PROMO_CODES[code];
        if (!promo) return 0;
        if (promo.type === "flat") return Math.min(promo.value, get().subtotal());
        if (promo.type === "pct") {
          const disc = Math.round(get().subtotal() * promo.value / 100);
          return promo.cap ? Math.min(disc, promo.cap) : disc;
        }
        return 0;
      },

      couponFreeShip() {
        const code = get().couponCode;
        if (!code) return false;
        const promo = PROMO_CODES[code];
        return promo?.type === "ship";
      },

      hasPhysicalItems() {
        return get().items.some((i) => i.type !== "gift-card");
      },

      shipping() {
        const { hasPhysicalItems, couponFreeShip, subtotal } = get();
        if (!hasPhysicalItems()) return 0;
        if (couponFreeShip()) return 0;
        if (get().items.some((i) => i.type === "sample-kit")) return 0;
        if (subtotal() >= FREE_SHIP_THRESHOLD) return 0;
        return SHIPPING_CHARGE;
      },

      total() {
        const { subtotal, couponDiscount, shipping, redeemedGiftAmount } = get();
        return Math.max(0, subtotal() - couponDiscount() - shipping() - redeemedGiftAmount);
      },
    }),
    {
      name: "cafefiro_cart_v1",
      partialize: (s) => ({
        items: s.items,
        couponCode: s.couponCode,
        redeemedGiftCode: s.redeemedGiftCode,
        redeemedGiftAmount: s.redeemedGiftAmount,
      }),
    }
  )
);

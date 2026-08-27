import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(paisa: number): string {
  return "₹" + (paisa / 100).toLocaleString("en-IN");
}

export function starArray(rating: number): number[] {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return 1;
    if (i < rating) return 0.5;
    return 0;
  });
}

const GIFT_CARD_KEY = "cafefiro_giftcards_v1";

export function getGiftCardBalance(code: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const store = JSON.parse(localStorage.getItem(GIFT_CARD_KEY) || "{}");
    return store[code]?.balance ?? 0;
  } catch { return 0; }
}

export function decrementGiftCard(code: string, amount: number): void {
  if (typeof window === "undefined") return;
  try {
    const store = JSON.parse(localStorage.getItem(GIFT_CARD_KEY) || "{}");
    if (store[code]) {
      store[code].balance = Math.max(0, store[code].balance - amount);
      localStorage.setItem(GIFT_CARD_KEY, JSON.stringify(store));
    }
  } catch {}
}

export function issueGiftCard(code: string, data: object): void {
  if (typeof window === "undefined") return;
  try {
    const store = JSON.parse(localStorage.getItem(GIFT_CARD_KEY) || "{}");
    store[code] = { ...data, issued: new Date().toISOString() };
    localStorage.setItem(GIFT_CARD_KEY, JSON.stringify(store));
  } catch {}
}

export function seedDemoGiftCard(): void {
  if (typeof window === "undefined") return;
  try {
    const store = JSON.parse(localStorage.getItem(GIFT_CARD_KEY) || "{}");
    if (!store["CAFE-GIFT-500"]) {
      store["CAFE-GIFT-500"] = { balance: 50000, amount: 50000, to: "You", from: "CafeFiro", msg: "Welcome gift", demo: true };
      localStorage.setItem(GIFT_CARD_KEY, JSON.stringify(store));
    }
  } catch {}
}

const ORDER_KEY = "cafefiro_orders_v1";

export interface Order {
  id: string;
  createdAt: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  shipping: { name: string; phone: string; address: string; city: string; pincode: string } | null;
  payment: string;
  issuedGiftCodes?: string[];
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const orders: Order[] = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
    orders.unshift(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    // also save to session user if logged in
    const session = localStorage.getItem("cafefiro_session_v1");
    if (session) {
      const users = JSON.parse(localStorage.getItem("cafefiro_users_v1") || "{}");
      if (users[session]) {
        users[session].orders = [order, ...(users[session].orders || [])];
        localStorage.setItem("cafefiro_users_v1", JSON.stringify(users));
      }
    }
  } catch {}
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]"); } catch { return []; }
}

const CLAIM_KEY = "cafefiro_partner_claimed_v1";
export function getClaimedCoupons(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CLAIM_KEY) || "[]"); } catch { return []; }
}
export function claimPartnerCoupon(code: string): void {
  if (typeof window === "undefined") return;
  const claimed = getClaimedCoupons();
  if (!claimed.includes(code)) {
    claimed.push(code);
    localStorage.setItem(CLAIM_KEY, JSON.stringify(claimed));
  }
}

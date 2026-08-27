"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  orders: string[];   // order ids
  totalSpent: number; // paisa
  wishlist: string[]; // product handles
  referralCode: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, phone: string, password: string) => string | null;
  logout: () => void;
  addAddress: (addr: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  toggleWishlist: (handle: string) => void;
  inWishlist: (handle: string) => boolean;
  recordOrder: (orderId: string, total: number) => void;
}

const USERS_KEY   = "cafefiro_users_v1";
const SESSION_KEY = "cafefiro_session_v1";
const WISH_KEY    = "cafefiro_wish_v1";

function loadUsers(): Record<string, User & { _pw: string }> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
}

function saveUsers(users: Record<string, User & { _pw: string }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function genReferral(name: string, email: string): string {
  const hash = Array.from(name + email).reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0);
  return "FIRO" + Math.abs(hash).toString(36).toUpperCase().slice(0, 5);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login(email, password) {
        const users = loadUsers();
        const record = users[email.toLowerCase()];
        if (!record) return "No account found with this email";
        if (record._pw !== password) return "Incorrect password";
        // sync wishlist
        const wish: string[] = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
        set({ user: { ...record, wishlist: wish.length ? wish : record.wishlist || [] } });
        localStorage.setItem(SESSION_KEY, email.toLowerCase());
        return null;
      },

      register(name, email, phone, password) {
        const users = loadUsers();
        const key = email.toLowerCase();
        if (users[key]) return "An account with this email already exists";
        if (password.length < 6) return "Password must be at least 6 characters";
        const newUser: User & { _pw: string } = {
          name, email: key, phone,
          addresses: [], orders: [], totalSpent: 0, wishlist: [],
          referralCode: genReferral(name, email),
          _pw: password,
        };
        users[key] = newUser;
        saveUsers(users);
        set({ user: newUser });
        localStorage.setItem(SESSION_KEY, key);
        return null;
      },

      logout() {
        set({ user: null });
        localStorage.removeItem(SESSION_KEY);
      },

      addAddress(addr) {
        set((s) => {
          if (!s.user) return s;
          const id = Math.random().toString(36).slice(2);
          const updated = { ...s.user, addresses: [...s.user.addresses, { ...addr, id }] };
          const users = loadUsers();
          users[s.user.email] = { ...users[s.user.email], ...updated };
          saveUsers(users);
          return { user: updated };
        });
      },

      removeAddress(id) {
        set((s) => {
          if (!s.user) return s;
          const updated = { ...s.user, addresses: s.user.addresses.filter((a) => a.id !== id) };
          const users = loadUsers();
          users[s.user.email] = { ...users[s.user.email], ...updated };
          saveUsers(users);
          return { user: updated };
        });
      },

      toggleWishlist(handle) {
        set((s) => {
          const wish: string[] = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
          const next = wish.includes(handle) ? wish.filter((h) => h !== handle) : [...wish, handle];
          localStorage.setItem(WISH_KEY, JSON.stringify(next));
          if (!s.user) return s;
          return { user: { ...s.user, wishlist: next } };
        });
      },

      inWishlist(handle) {
        const { user } = get();
        if (user) return user.wishlist.includes(handle);
        if (typeof window === "undefined") return false;
        try {
          const wish: string[] = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
          return wish.includes(handle);
        } catch { return false; }
      },

      recordOrder(orderId, total) {
        set((s) => {
          if (!s.user) return s;
          const updated = {
            ...s.user,
            orders: [orderId, ...s.user.orders],
            totalSpent: s.user.totalSpent + total,
          };
          const users = loadUsers();
          users[s.user.email] = { ...users[s.user.email], ...updated };
          saveUsers(users);
          return { user: updated };
        });
      },
    }),
    {
      name: "cafefiro_auth_v1",
      partialize: (s) => ({ user: s.user }),
    }
  )
);

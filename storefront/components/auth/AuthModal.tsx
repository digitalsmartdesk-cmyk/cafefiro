"use client";
import { useState } from "react";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/components/ui/Toast";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register }   = useAuthStore();
  const { toast }             = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const err = tab === "login"
      ? login(email.trim(), password)
      : register(name.trim(), email.trim(), phone.trim(), password);
    setLoading(false);
    if (err) { setError(err); return; }
    toast(tab === "login" ? "Welcome back! 👋" : "Account created! Welcome to CafeFiro 🎉");
    onClose();
  }

  const perks = ["Early access to new mixes", "Order history & tracking", "Wishlist & saved addresses", "₹100 refer-a-friend bonus"];

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <ModalClose onClose={onClose} />
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr]">
        {/* Left perk panel */}
        <div className="hidden sm:flex flex-col bg-forest p-8 rounded-l-[var(--radius-xl)]">
          <div className="mb-6">
            <p className="text-ember font-bold text-xs uppercase tracking-widest mb-2">CafeFiro Account</p>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-cream leading-tight">
              Cook more.<br />Save more.
            </h2>
          </div>
          <ul className="space-y-3 flex-1">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-cream/80">
                <span className="text-ember mt-0.5">✓</span> {p}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <p className="text-xs text-cream/40">100% Vegetarian · Made in India 🇮🇳</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex bg-cream-2 rounded-full p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${tab === t ? "bg-ink text-white shadow-sm" : "text-ink-soft hover:text-ink"}`}
              >
                {t === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "register" && (
              <div>
                <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm" />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="priya@email.com"
                className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm" />
            </div>
            {tab === "register" && (
              <div>
                <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm" />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••"
                className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm" />
            </div>

            {error && <p className="text-xs text-brick bg-brick/5 border border-brick/20 rounded-[var(--radius)] px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-full bg-brick text-white font-black hover:bg-brick-deep transition-all disabled:opacity-60">
              {loading ? "…" : tab === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs text-ink-soft mt-4">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
              className="text-ember font-bold hover:underline">
              {tab === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
          <p className="text-center text-xs text-ink-soft/50 mt-2">
            Demo: passwords are stored locally for prototype purposes.
          </p>
        </div>
      </div>
    </Modal>
  );
}

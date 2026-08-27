"use client";
import { useState } from "react";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { useAuthStore } from "@/lib/auth-store";
import { useCartStore } from "@/lib/cart-store";
import { PRODUCTS, formatPrice } from "@/lib/catalog";
import { getOrders, Order } from "@/lib/utils";
import Image from "next/image";

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
  initialTab?: AccountTab;
}

type AccountTab = "account" | "orders" | "wishlist" | "addresses" | "refer";

const TABS: Array<{ id: AccountTab; label: string; icon: string }> = [
  { id: "account",   label: "My Account",    icon: "👤" },
  { id: "orders",    label: "My Orders",     icon: "📦" },
  { id: "wishlist",  label: "Wishlist",      icon: "❤️" },
  { id: "addresses", label: "Address Book",  icon: "📍" },
  { id: "refer",     label: "Refer & Earn",  icon: "🎁" },
];

export function AccountModal({ open, onClose, onTrackOrder, initialTab = "account" }: AccountModalProps) {
  const [tab, setTab] = useState<AccountTab>(initialTab);
  const { user, logout, removeAddress, toggleWishlist } = useAuthStore();
  const addProduct = useCartStore((s) => s.addProduct);

  if (!user) return null;
  const orders = getOrders();
  const wishlistProducts = PRODUCTS.filter((p) => user.wishlist.includes(p.handle));

  function orderStatus(createdAt: string): string {
    const h = (Date.now() - new Date(createdAt).getTime()) / 36e5;
    if (h < 18) return "Confirmed";
    if (h < 36) return "Packed";
    if (h < 84) return "Shipped";
    if (h < 108) return "Out for Delivery";
    return "Delivered";
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-3xl" tall>
      <ModalClose onClose={onClose} />
      <div className="flex min-h-[520px]">
        {/* Sidebar */}
        <div className="w-56 shrink-0 bg-ink rounded-l-[var(--radius-xl)] p-5 flex flex-col">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-brick text-white flex items-center justify-center text-2xl font-black mb-2">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="font-bold text-cream text-sm">{user.name}</p>
            <p className="text-cream/50 text-xs">{user.email}</p>
          </div>
          <nav className="flex-1 space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-sm font-semibold transition-colors text-left ${
                  tab === t.id ? "bg-brick text-white" : "text-cream/70 hover:bg-cream/10 hover:text-cream"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
          <button onClick={() => { logout(); onClose(); }} className="text-xs text-cream/40 hover:text-brick transition-colors mt-4">
            Log out
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {tab === "account" && (
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink mb-5">My Account</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Orders", value: user.orders.length },
                  { label: "Wishlist", value: user.wishlist.length },
                  { label: "Addresses", value: user.addresses.length },
                  { label: "Total spent", value: formatPrice(user.totalSpent) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-cream rounded-[var(--radius)] p-4 border border-line">
                    <p className="text-2xl font-black text-ink">{value}</p>
                    <p className="text-xs text-ink-soft font-semibold">{label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-cream rounded-[var(--radius)] p-4 border border-line">
                <p className="text-xs font-bold text-ink-soft uppercase tracking-widest mb-3">Profile</p>
                <dl className="space-y-2 text-sm">
                  {[["Name", user.name], ["Email", user.email], ["Phone", user.phone || "—"]].map(([k, v]) => (
                    <div key={k} className="flex gap-4">
                      <dt className="text-ink-soft w-16">{k}</dt>
                      <dd className="font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink mb-5">My Orders</h2>
              {orders.length === 0 ? (
                <p className="text-ink-soft text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => {
                    const status = orderStatus(o.createdAt);
                    const statusColor = { Confirmed: "bg-ember/10 text-ember", Packed: "bg-blue-100 text-blue-700", Shipped: "bg-purple-100 text-purple-700", "Out for Delivery": "bg-orange-100 text-orange-700", Delivered: "bg-veg/10 text-veg" }[status] || "";
                    return (
                      <div key={o.id} className="bg-cream rounded-[var(--radius)] border border-line p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-sm text-ink">{o.id}</p>
                            <p className="text-xs text-ink-soft">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>{status}</span>
                        </div>
                        <p className="text-xs text-ink-soft mb-3">{o.items.map((i) => i.name).join(", ")}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-ink">{formatPrice(o.total)}</p>
                          {o.shipping && (
                            <button
                              onClick={() => onTrackOrder(o.id)}
                              className="text-xs font-bold text-brick hover:underline"
                            >
                              🚚 Track order
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink mb-5">My Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <p className="text-ink-soft text-sm">Your wishlist is empty.</p>
              ) : (
                <div className="space-y-3">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 bg-cream rounded-[var(--radius)] border border-line p-3">
                      <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0">
                        <Image src={p.image} alt={p.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-ink">{p.title}</p>
                        <p className="text-xs text-ink-soft">{formatPrice(p.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => addProduct(p.handle)} className="px-3 py-1.5 rounded-full bg-forest text-white font-bold text-xs hover:bg-forest-deep transition-colors">
                          Add to cart
                        </button>
                        <button onClick={() => toggleWishlist(p.handle)} className="text-brick hover:opacity-70 transition-opacity">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink mb-5">Address Book</h2>
              {user.addresses.length === 0 ? (
                <p className="text-ink-soft text-sm">No saved addresses. Add one at checkout.</p>
              ) : (
                <div className="space-y-3">
                  {user.addresses.map((a) => (
                    <div key={a.id} className="bg-cream rounded-[var(--radius)] border border-line p-4 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-ink">{a.name}</p>
                        <p className="text-xs text-ink-soft">{a.phone}</p>
                        <p className="text-xs text-ink-soft mt-1">{a.line1}, {a.city} – {a.pincode}</p>
                      </div>
                      <button onClick={() => removeAddress(a.id)} className="text-xs text-brick hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "refer" && (
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink mb-2">Refer & Earn</h2>
              <p className="text-ink-soft text-sm mb-6">Give ₹100 to a friend, get ₹100 when they order.</p>
              <div className="bg-cream rounded-[var(--radius-lg)] border border-line p-5 mb-5">
                <p className="text-xs font-bold text-ink-soft uppercase tracking-widest mb-2">Your referral code</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2.5 rounded-[var(--radius)] bg-paper border border-line font-black text-brick text-lg tracking-widest">
                    {user.referralCode}
                  </code>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(user.referralCode); }}
                    className="px-4 py-2.5 rounded-[var(--radius)] bg-ink text-white font-bold text-sm hover:bg-ink/90 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-ink-soft mt-2">Share this code — your friend gets ₹100 off, you earn ₹100 credit.</p>
              </div>
              <a
                href={`https://wa.me/?text=Use%20my%20CafeFiro%20code%20${user.referralCode}%20and%20get%20%E2%82%B9100%20off!%20cafefiro.in`}
                target="_blank" rel="noopener"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-whatsapp text-white font-bold hover:opacity-90 transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Share via WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

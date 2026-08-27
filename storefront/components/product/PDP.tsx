"use client";
import { useState } from "react";
import Image from "next/image";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { PRODUCTS, productByHandle, formatPrice, discountPct, pincodeInfo, SUB_FREQUENCIES } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/components/ui/Toast";
import { StarRating } from "@/components/ui/StarRating";

interface PDPProps {
  handle: string | null;
  onClose: () => void;
  onCartOpen: () => void;
}

type TabKey = "overview" | "ingredients" | "cook" | "reviews";

interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const SEED_REVIEWS: Record<string, Review[]> = {
  "soya-galouti-kebab": [
    { author: "Meera K.", rating: 5, comment: "Absolutely melt in your mouth! My family couldn't believe it was from a mix.", date: "2025-11-12" },
    { author: "Rajan S.", rating: 4, comment: "Great flavour, followed the recipe perfectly. Will reorder.", date: "2025-10-28" },
  ],
  "paneer-seekh-kebab": [
    { author: "Aarav T.", rating: 5, comment: "My teenage son made this on his own — came out perfect!", date: "2025-12-01" },
  ],
  "aloo-tikki": [
    { author: "Priya M.", rating: 5, comment: "Better than my local street stall. No jokes.", date: "2026-01-15" },
    { author: "Vikram D.", rating: 4, comment: "Classic taste. The kids devoured them.", date: "2025-12-20" },
  ],
};

export function PDP({ handle, onClose, onCartOpen }: PDPProps) {
  const p = handle ? productByHandle(handle) : null;
  const [tab, setTab]         = useState<TabKey>("overview");
  const [qty, setQty]         = useState(1);
  const [mode, setMode]       = useState<"once" | "sub">("once");
  const [freq, setFreq]       = useState("1m");
  const [pin, setPin]         = useState("");
  const [pinInfo, setPinInfo] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText]     = useState("");
  const [userReviews, setUserReviews]   = useState<Review[]>([]);

  const { addProduct, toggleSubscribe } = useCartStore();
  const { user, toggleWishlist, inWishlist } = useAuthStore();
  const { toast } = useToast();

  if (!p) return null;
  const wishlisted = inWishlist(p.handle);
  const pct = discountPct(p.price, p.mrp);
  const linePrice = mode === "sub" ? Math.round(p.price * qty * 0.85) : p.price * qty;
  const seedReviews = SEED_REVIEWS[p.handle] || [];
  const allReviews = [...seedReviews, ...userReviews];

  function handleAdd() {
    addProduct(p!.handle, qty);
    if (mode === "sub") toggleSubscribe(p!.handle, freq);
    toast(`✓ ${p!.title} added to cart`);
  }

  function handleBuyNow() {
    handleAdd();
    onClose();
    onCartOpen();
  }

  function checkPin() {
    const info = pincodeInfo(pin);
    if (!info) { setPinInfo("Not serviceable to this pincode."); return; }
    setPinInfo(`✓ Delivery in ${info.days}${info.cod ? " · COD available" : " · Prepaid only"}`);
  }

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast("Please log in to leave a review"); return; }
    if (!reviewText.trim()) return;
    setUserReviews((r) => [...r, { author: user.name, rating: reviewRating, comment: reviewText, date: new Date().toISOString().slice(0, 10) }]);
    setReviewText("");
    toast("✓ Review posted");
  }

  const related = PRODUCTS.filter((q) => q.category === p.category && q.id !== p.id).slice(0, 4);
  const tabs: Array<{ id: TabKey; label: string }> = [
    { id: "overview",    label: "Overview" },
    { id: "ingredients", label: "Ingredients & Nutrition" },
    { id: "cook",        label: "How to Cook" },
    { id: "reviews",     label: `Reviews (${allReviews.length})` },
  ];

  return (
    <Modal open={!!p} onClose={onClose} className="max-w-4xl" tall>
      <ModalClose onClose={onClose} />
      <div className="grid grid-cols-1 min-[900px]:grid-cols-[.9fr_1.1fr]">
        {/* Image */}
        <div className="relative bg-cream rounded-tl-[var(--radius-xl)] min-[900px]:rounded-bl-[var(--radius-xl)] overflow-hidden" style={{ minHeight: 320 }}>
          <Image src={p.image} alt={p.title} fill className="object-cover" />
          {pct > 0 && (
            <span className="absolute top-3 right-3 bg-brick text-white text-xs font-black px-3 py-1 rounded-full">
              {pct}% OFF
            </span>
          )}
          <button
            onClick={() => { toggleWishlist(p.handle); toast(wishlisted ? "Removed from wishlist" : "❤️ Saved"); }}
            className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center shadow-[var(--shadow-sm)] transition-colors text-base ${wishlisted ? "bg-brick text-white" : "bg-paper/90 text-ink-soft hover:bg-paper"}`}
          >
            {wishlisted ? "♥" : "♡"}
          </button>
        </div>

        {/* Info */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <p className="text-xs font-bold text-ink-soft mb-1">{p.category}</p>
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-ink leading-tight mb-1">{p.title}</h2>
          <p className="text-ink-soft text-sm mb-3">{p.subtitle}</p>

          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={p.rating} size={16} />
            <span className="font-bold text-ember text-sm">{p.rating}</span>
            <button onClick={() => setTab("reviews")} className="text-sm text-ink-soft hover:text-ember transition-colors">
              · {allReviews.length} reviews
            </button>
          </div>

          <div className="mb-4">
            <span className="font-black text-2xl text-ink">{formatPrice(p.price)}</span>
            {pct > 0 && (
              <>
                <span className="text-ink-soft text-sm line-through ml-2">{formatPrice(p.mrp)}</span>
                <span className="text-veg text-sm font-bold ml-1.5">{pct}% off</span>
              </>
            )}
            <div className="text-xs text-ink-soft mt-0.5">{p.weight} pack · (incl. of all taxes)</div>
          </div>

          {/* Purchase mode */}
          <div className="space-y-2 mb-4">
            {(["once", "sub"] as const).map((m) => (
              <label key={m} className={`flex items-start gap-3 p-3 rounded-[var(--radius)] border cursor-pointer transition-colors ${mode === m ? "border-brick bg-brick/5" : "border-line hover:border-ink/30"}`}>
                <input type="radio" checked={mode === m} onChange={() => setMode(m)} className="accent-brick mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-ink">{m === "once" ? "One-time purchase" : "Subscribe & Save 15%"}</p>
                  {m === "sub" && (
                    <select value={freq} onChange={(e) => setFreq(e.target.value)} onClick={(e) => e.stopPropagation()}
                      className="mt-1 text-xs bg-transparent border-none outline-none cursor-pointer text-ink-soft">
                      {Object.entries(SUB_FREQUENCIES).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  )}
                </div>
                <span className="font-bold text-sm">{formatPrice(m === "sub" ? Math.round(p.price * 0.85) : p.price)}</span>
              </label>
            ))}
          </div>

          {/* Qty + Add */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1 bg-cream-2 rounded-full px-1 py-0.5 border border-line">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink font-bold">−</button>
              <span className="w-8 text-center font-bold text-ink">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink font-bold">+</button>
            </div>
            <button onClick={handleAdd}
              className="flex-1 py-3 rounded-full bg-forest text-white font-black hover:bg-forest-deep transition-all hover:-translate-y-0.5">
              Add to Cart · {formatPrice(linePrice)}
            </button>
          </div>
          <button onClick={handleBuyNow}
            className="w-full py-3 rounded-full bg-ink text-white font-black hover:bg-ink/90 transition-all mb-4">
            ⚡ Buy it now
          </button>

          {/* Pincode */}
          <div className="flex gap-2 mb-5">
            <input value={pin} onChange={(e) => { setPin(e.target.value); setPinInfo(null); }} onKeyDown={(e) => { if (e.key === "Enter") checkPin(); }}
              placeholder="Check delivery pincode" maxLength={6}
              className="flex-1 px-4 py-2 rounded-full border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink placeholder:text-ink-soft/60" />
            <button onClick={checkPin} className="px-4 py-2 rounded-full bg-ink text-white font-bold text-sm hover:bg-ink/90 transition-colors">
              Check
            </button>
          </div>
          {pinInfo && <p className={`text-xs mb-4 ${pinInfo.startsWith("✓") ? "text-veg" : "text-brick"}`}>{pinInfo}</p>}

          {/* Tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${tab === t.id ? "bg-ink text-white" : "bg-cream-2 text-ink-soft hover:bg-cream-3"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "overview" && (
            <div>
              <p className="text-sm text-ink-soft leading-relaxed mb-4">{p.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[["Serves", p.servings], ["Shelf life", p.shelf], ["Diet", p.diet], ["Weight", p.weight]].map(([k, v]) => (
                  <div key={k} className="bg-cream rounded-[var(--radius)] p-3 border border-line">
                    <p className="text-xs text-ink-soft">{k}</p>
                    <p className="font-bold text-sm text-ink">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-veg/10 text-veg text-xs font-bold border border-veg/20">🥬 100% Vegetarian</span>
                <span className="px-3 py-1.5 rounded-full bg-cream text-ink-soft text-xs font-bold border border-line">✨ No Preservatives</span>
              </div>
            </div>
          )}

          {tab === "ingredients" && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-bold text-ink mb-1">Ingredients</p>
                <p className="text-ink-soft leading-relaxed">{p.ingredients || "See pack for full ingredient list."}</p>
              </div>
              {p.allergens && (
                <div>
                  <p className="font-bold text-ink mb-1">Allergen information</p>
                  <p className="text-ink-soft">{p.allergens}</p>
                </div>
              )}
              {p.nutrition && (
                <div>
                  <p className="font-bold text-ink mb-2">Nutrition (per 100g)</p>
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      {p.nutrition.map((n) => (
                        <tr key={n.label} className="border-b border-line">
                          <td className="py-1.5 text-ink-soft">{n.label}</td>
                          <td className="py-1.5 text-right font-semibold text-ink">{n.per100g}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "cook" && (
            <div>
              {p.cookSteps ? (
                <ol className="space-y-3">
                  {p.cookSteps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink-soft">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-ember text-white flex items-center justify-center font-bold text-xs">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-ink-soft">Cook instructions are printed on the pack.</p>
              )}
              {p.cookTip && (
                <div className="mt-4 p-3 bg-ember/10 border border-ember/20 rounded-[var(--radius)] text-sm">
                  <span className="font-bold text-ember">💡 Tip: </span>
                  <span className="text-ink-soft">{p.cookTip}</span>
                </div>
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div>
              {allReviews.length === 0 ? (
                <p className="text-sm text-ink-soft mb-4">No reviews yet — be the first!</p>
              ) : (
                <div className="space-y-3 mb-5">
                  {allReviews.map((r, i) => (
                    <div key={i} className="bg-cream rounded-[var(--radius)] p-3 border border-line">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={r.rating} size={12} />
                        <span className="font-bold text-xs text-ink">{r.author}</span>
                        <span className="text-xs text-ink-soft ml-auto">{r.date}</span>
                      </div>
                      <p className="text-sm text-ink-soft">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {user ? (
                <form onSubmit={submitReview} className="space-y-3 border-t border-line pt-4">
                  <p className="font-bold text-sm text-ink">Write a review</p>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewRating(s)}
                        className={`text-2xl transition-opacity ${s <= reviewRating ? "opacity-100" : "opacity-30"}`}>
                        ⭐
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required
                    placeholder="Share your experience…" rows={3}
                    className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink resize-none" />
                  <button type="submit" className="px-5 py-2 rounded-full bg-brick text-white font-bold text-sm hover:bg-brick-deep transition-colors">
                    Post review
                  </button>
                </form>
              ) : (
                <p className="text-sm text-ink-soft border-t border-line pt-4">Log in to leave a review.</p>
              )}
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="font-bold text-sm text-ink mb-3">You may also like</p>
              <div className="grid grid-cols-2 gap-2">
                {related.slice(0, 2).map((r) => (
                  <div key={r.id} className="flex items-center gap-2 bg-cream rounded-[var(--radius)] p-2 border border-line">
                    <div className="relative w-10 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={r.image} alt={r.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink line-clamp-2">{r.title}</p>
                      <p className="text-xs text-ember font-bold">{formatPrice(r.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { PRODUCTS, BUNDLES, formatPrice, FREE_SHIP_THRESHOLD, SHIPPING_CHARGE, SUB_FREQUENCIES } from "@/lib/catalog";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const {
    items, couponCode, redeemedGiftCode, redeemedGiftAmount,
    removeItem, updateQty, toggleSubscribe, applyCoupon, removeCoupon, redeemGiftCard, removeGiftRedemption,
    subtotal, subSavings, couponDiscount, shipping, total, hasPhysicalItems, couponFreeShip,
  } = useCartStore();
  const { toast } = useToast();
  const [codeInput, setCodeInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function handleCode() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    // Try promo first, then gift card
    const promoErr = applyCoupon(code);
    if (!promoErr) { toast("✓ Coupon applied"); setCodeInput(""); return; }
    const giftErr = redeemGiftCard(code);
    if (!giftErr) { toast("✓ Gift card applied"); setCodeInput(""); return; }
    toast("Invalid code — try a coupon or gift card code");
  }

  const sub = subtotal();
  const freeShipAt = FREE_SHIP_THRESHOLD;
  const progress = Math.min(100, (sub / freeShipAt) * 100);
  const needForFreeShip = Math.max(0, freeShipAt - sub);
  const physical = hasPhysicalItems();

  return (
    <>
      {/* Scrim */}
      {open && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-[420px] bg-paper shadow-[var(--shadow-lg)] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink">Your Cart</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-soft hover:bg-cream-2 transition-colors text-sm font-bold">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <span className="text-5xl mb-4">🛒</span>
            <p className="font-bold text-ink text-lg mb-2">Your cart is empty</p>
            <p className="text-ink-soft text-sm mb-6">Add a mix or bundle to get started.</p>
            <button onClick={onClose} className="px-6 py-3 rounded-full bg-brick text-white font-bold hover:bg-brick-deep transition-colors">
              Shop the range
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping bar */}
            {physical && (
              <div className="px-5 py-3 border-b border-line">
                {needForFreeShip > 0 ? (
                  <p className="text-xs text-ink-soft mb-1.5">Add <b className="text-ink">{formatPrice(needForFreeShip)}</b> more for FREE shipping</p>
                ) : (
                  <p className="text-xs text-veg font-bold mb-1.5">🎉 You've unlocked FREE shipping!</p>
                )}
                <div className="h-1.5 bg-cream-3 rounded-full overflow-hidden">
                  <div className="h-full bg-veg rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => {
                let name = "", price = 0, image = "";
                if (item.type === "product") {
                  const p = PRODUCTS.find((x) => x.handle === item.id);
                  if (!p) return null;
                  name = p.title; price = p.price; image = p.image;
                } else if (item.type === "bundle") {
                  const b = BUNDLES.find((x) => x.id === item.id);
                  if (!b) return null;
                  name = b.name; price = b.price; image = PRODUCTS[0].image;
                } else if (item.type === "sample-kit") {
                  name = "Sample Kit (8 half-size packs)"; price = 49900; image = PRODUCTS[0].image;
                } else if (item.type === "gift-card" && item.gift) {
                  name = `Gift Card → ${item.gift.to}`; price = item.gift.amount; image = "";
                }
                const linePrice = item.type === "product" && item.subFreq
                  ? Math.round(price * item.qty * 0.85)
                  : price * item.qty;

                return (
                  <div key={item.id} className="flex gap-3">
                    {image ? (
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-cream shrink-0">
                        <Image src={image} alt={name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-20 rounded-xl bg-cream-2 border border-line shrink-0 flex items-center justify-center text-2xl">🎁</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink leading-tight mb-0.5 line-clamp-2">{name}</p>
                      {item.type === "product" && item.subFreq && (
                        <span className="text-[10px] font-bold text-veg bg-veg/10 px-2 py-0.5 rounded-full">
                          🔄 Subscribe · {SUB_FREQUENCIES[item.subFreq]}
                        </span>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {item.type !== "gift-card" && item.type !== "sample-kit" && (
                          <div className="flex items-center gap-1 bg-cream-2 rounded-full px-1 py-0.5">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 h-5 flex items-center justify-center text-ink-soft hover:text-ink text-sm font-bold">−</button>
                            <span className="text-xs font-bold text-ink w-5 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 h-5 flex items-center justify-center text-ink-soft hover:text-ink text-sm font-bold">+</button>
                          </div>
                        )}
                        <button onClick={() => removeItem(item.id)} className="text-xs text-ink-soft hover:text-brick transition-colors">Remove</button>
                      </div>
                      {item.type === "product" && (
                        <button
                          onClick={() => toggleSubscribe(item.id)}
                          className={`mt-1 text-[10px] font-bold transition-colors ${item.subFreq ? "text-brick" : "text-forest hover:text-forest-deep"}`}
                        >
                          {item.subFreq ? "✓ Subscribed · click to remove" : "🔄 Subscribe & Save 15%"}
                        </button>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-ink">{formatPrice(linePrice)}</p>
                      {item.type === "product" && item.subFreq && (
                        <p className="text-xs text-ink-soft line-through">{formatPrice(price * item.qty)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-line px-5 py-4 space-y-3">
              {/* Code box */}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCode(); }}
                  placeholder="Promo or gift code"
                  className="flex-1 px-4 py-2 rounded-full bg-cream-2 border border-transparent focus:border-ember focus:outline-none text-sm text-ink placeholder:text-ink-soft/60"
                />
                <button onClick={handleCode} className="px-4 py-2 rounded-full bg-ink text-white font-bold text-sm hover:bg-ink/90 transition-colors">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(sub)}</span>
                </div>
                {subSavings() > 0 && (
                  <div className="flex justify-between text-veg text-xs">
                    <span>↻ Subscribe & Save</span>
                    <span>−{formatPrice(subSavings())}</span>
                  </div>
                )}
                {couponCode && (
                  <div className="flex justify-between text-veg text-xs">
                    <span className="flex items-center gap-1">
                      🏷 {couponCode}
                      <button onClick={removeCoupon} className="text-brick ml-1">✕</button>
                    </span>
                    <span>−{formatPrice(couponDiscount())}</span>
                  </div>
                )}
                {redeemedGiftCode && (
                  <div className="flex justify-between text-veg text-xs">
                    <span className="flex items-center gap-1">
                      🎁 {redeemedGiftCode}
                      <button onClick={removeGiftRedemption} className="text-brick ml-1">✕</button>
                    </span>
                    <span>−{formatPrice(Math.min(redeemedGiftAmount, sub))}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-soft text-xs">
                  <span>Shipping</span>
                  <span className={shipping() === 0 ? "text-veg font-bold" : "text-ink"}>
                    {shipping() === 0 ? "FREE" : formatPrice(shipping())}
                  </span>
                </div>
                <div className="flex justify-between font-black text-base text-ink border-t border-line pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(total())}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3.5 rounded-full bg-brick text-white font-black text-base hover:bg-brick-deep transition-all hover:-translate-y-0.5 active:scale-[.98]"
              >
                Proceed to Checkout →
              </button>
              <p className="text-center text-xs text-ink-soft">🔒 Secure checkout · UPI · Card · COD</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

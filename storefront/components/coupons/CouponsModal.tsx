"use client";
import { useState } from "react";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { PARTNER_COUPONS } from "@/lib/catalog";
import { getClaimedCoupons, claimPartnerCoupon } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface CouponsModalProps {
  open: boolean;
  onClose: () => void;
  cartSubtotal: number;
  onContinue?: () => void;
  isInterstitial?: boolean;
}

export function CouponsModal({ open, onClose, cartSubtotal, onContinue, isInterstitial }: CouponsModalProps) {
  const [claimed, setClaimed] = useState<string[]>(getClaimedCoupons());
  const { toast } = useToast();

  function claim(code: string) {
    if (claimed.includes(code)) {
      navigator.clipboard?.writeText(code).catch(() => {});
      toast("✓ " + code + " copied");
      return;
    }
    if (claimed.length > 0) { toast("Only one coupon per customer"); return; }
    claimPartnerCoupon(code);
    const next = [...claimed, code];
    setClaimed(next);
    navigator.clipboard?.writeText(code).catch(() => {});
    toast("✓ " + code + " copied — use it on the partner site");
  }

  function handleContinue() { onClose(); if (onContinue) setTimeout(onContinue, 260); }

  return (
    <Modal open={open} onClose={isInterstitial ? handleContinue : onClose} className="max-w-xl" tall>
      <ModalClose onClose={isInterstitial ? handleContinue : onClose} />
      <div className="p-6 overflow-y-auto max-h-[80vh]">
        {isInterstitial && (
          <>
            <div className="text-center text-4xl mb-2">🎁</div>
            <span className="eyebrow justify-center mb-2 block">CafeFiro Perks</span>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl text-ink text-center mb-2">
              You've unlocked partner coupons!
            </h2>
            <p className="text-center text-ink-soft text-sm mb-6">
              A little thank-you for shopping with us — claim one of these exclusive coupons to use on our partner sites.
            </p>
          </>
        )}
        {!isInterstitial && (
          <>
            <span className="eyebrow mb-3 block">Partner Perks</span>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl text-ink mb-2">Coupons & Partner Offers</h2>
            <p className="text-ink-soft text-sm mb-6">Shopping with CafeFiro earns you exclusive coupons for partner brands. Claim one below.</p>
          </>
        )}

        <div className="space-y-4 mb-6">
          {PARTNER_COUPONS.map((c) => {
            const unlocked = cartSubtotal >= c.threshold;
            const isClaimed = claimed.includes(c.code);
            const anyClaimed = claimed.length > 0;
            const need = Math.max(0, c.threshold - cartSubtotal);

            return (
              <div
                key={c.code}
                className={`flex overflow-hidden rounded-2xl border transition-opacity ${isClaimed ? "border-2" : "border-line"} ${(!unlocked && !isClaimed) ? "opacity-60" : ""}`}
                style={isClaimed ? { borderColor: c.color } : {}}
              >
                {/* Stub */}
                <div className="w-20 shrink-0 flex flex-col items-center justify-center py-5 text-white" style={{ background: c.color }}>
                  <span className="text-2xl mb-1">{(unlocked || isClaimed) ? c.emoji : "🔒"}</span>
                  <span className="font-black text-xl leading-none">₹{c.amount}</span>
                  <span className="text-xs opacity-80">OFF</span>
                </div>
                {/* Perf line */}
                <div className="w-5 bg-paper flex flex-col items-center justify-between py-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="w-2 h-2 rounded-full border border-line bg-paper" />
                  ))}
                </div>
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-1">
                    <b className="text-sm text-ink">{c.partner}</b>
                    <span className="text-xs text-ink-soft">{c.cat}</span>
                  </div>
                  <p className="text-xs text-ink-soft mb-2">{c.desc}</p>
                  <p className="text-xs text-ink-soft/60 mb-3">
                    Unlocks at ₹{(c.threshold / 100).toLocaleString("en-IN")} cart · Min spend ₹{c.min} on partner
                  </p>
                  {isClaimed ? (
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1 rounded-lg bg-cream border border-line font-bold text-sm text-brick flex-1">{c.code}</code>
                      <button onClick={() => claim(c.code)} className="px-3 py-1.5 rounded-full text-white font-bold text-xs" style={{ background: c.color }}>
                        📋 Copy
                      </button>
                    </div>
                  ) : anyClaimed ? (
                    <p className="text-xs text-ink-soft">✓ You've already claimed your coupon for this order.</p>
                  ) : unlocked ? (
                    <button onClick={() => claim(c.code)} className="px-4 py-2 rounded-full text-white font-bold text-xs hover:opacity-90 transition-opacity" style={{ background: c.color }}>
                      Claim code
                    </button>
                  ) : (
                    <p className="text-xs font-semibold" style={{ color: c.color }}>
                      🔒 Add ₹{((c.threshold - cartSubtotal) / 100).toLocaleString("en-IN")} more to unlock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isInterstitial ? (
          <div className="flex flex-col gap-2">
            <button onClick={handleContinue} className="w-full py-3.5 rounded-full bg-brick text-white font-black hover:bg-brick-deep transition-all">
              Continue to Checkout →
            </button>
            <button onClick={handleContinue} className="text-sm text-ink-soft hover:text-ink transition-colors">
              View all perks later
            </button>
          </div>
        ) : (
          <p className="text-xs text-ink-soft text-center">Codes are single-use per customer and subject to each partner's terms.</p>
        )}
      </div>
    </Modal>
  );
}

"use client";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { useAuthStore } from "@/lib/auth-store";
import { getOrders } from "@/lib/utils";

interface OrderSuccessProps {
  open: boolean;
  orderId: string;
  issuedCodes: string[];
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export function OrderSuccess({ open, orderId, issuedCodes, onClose, onTrackOrder }: OrderSuccessProps) {
  const { user } = useAuthStore();
  const order = getOrders().find((o) => o.id === orderId);
  const isPhysical = !!order?.shipping;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalClose onClose={onClose} />
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-veg/10 border-2 border-veg flex items-center justify-center text-3xl mx-auto mb-4">
          ✓
        </div>
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-ink mb-2">Order placed!</h2>
        <p className="text-ink-soft mb-1">Your order ID is</p>
        <code className="font-black text-brick text-xl mb-4 block">{orderId}</code>
        <p className="text-sm text-ink-soft mb-6">
          {isPhysical
            ? "We'll start preparing your order right away. You'll receive tracking updates by SMS & email."
            : "Your digital gift card will be delivered by email on your chosen date."}
        </p>

        {issuedCodes.length > 0 && (
          <div className="bg-cream border border-line rounded-[var(--radius-lg)] p-4 mb-5 text-left">
            <p className="font-bold text-sm text-ink mb-2">🎁 Gift card code{issuedCodes.length > 1 ? "s" : ""} issued</p>
            {issuedCodes.map((code) => (
              <div key={code} className="flex items-center gap-2 mb-1">
                <code className="flex-1 px-3 py-1.5 bg-paper border border-line rounded-[var(--radius)] font-bold text-brick text-sm">{code}</code>
                <button onClick={() => navigator.clipboard?.writeText(code)} className="text-xs text-ink-soft hover:text-ink">Copy</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {user && isPhysical && (
            <button
              onClick={() => { onTrackOrder(orderId); onClose(); }}
              className="py-3 rounded-full bg-brick text-white font-black hover:bg-brick-deep transition-all"
            >
              🚚 Track Order
            </button>
          )}
          <button onClick={onClose} className="py-3 rounded-full bg-cream border border-line text-ink font-bold hover:bg-cream-2 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    </Modal>
  );
}

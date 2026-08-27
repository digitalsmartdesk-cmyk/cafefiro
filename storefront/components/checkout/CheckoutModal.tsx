"use client";
import { useState } from "react";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { PRODUCTS, BUNDLES, SAMPLE_KIT_PRICE, formatPrice, pincodeInfo } from "@/lib/catalog";
import { saveOrder, issueGiftCard, decrementGiftCard } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (orderId: string, issuedCodes: string[]) => void;
}

declare global {
  interface Window {
    Razorpay: new (opts: object) => { open(): void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

export function CheckoutModal({ open, onClose, onSuccess }: CheckoutModalProps) {
  const { items, couponCode, redeemedGiftCode, redeemedGiftAmount,
    subtotal, couponDiscount, shipping, total, hasPhysicalItems, clearCart } = useCartStore();
  const { user, addAddress, recordOrder } = useAuthStore();
  const { toast } = useToast();

  const [name, setName]         = useState(user?.name || "");
  const [phone, setPhone]       = useState(user?.phone || "");
  const [email, setEmail]       = useState(user?.email || "");
  const [line1, setLine1]       = useState("");
  const [city, setCity]         = useState("");
  const [pincode, setPincode]   = useState("");
  const [pincodeOk, setPincodeOk] = useState<null | true | string>(null);
  const [payment, setPayment]   = useState("upi");
  const [placing, setPlacing]   = useState(false);
  const [saveAddr, setSaveAddr] = useState(true);

  const physical = hasPhysicalItems();
  const tot = total();

  function checkPin() {
    const info = pincodeInfo(pincode);
    if (!info) { setPincodeOk("Not serviceable to this pincode"); return; }
    setPincodeOk(true);
    toast(`✓ Delivery in ${info.days}${info.cod ? " · COD available" : ""}`);
  }

  async function placeOrder() {
    if (!name || !phone || !email) { toast("Please fill all required fields"); return; }
    if (physical && !pincode) { toast("Please enter your pincode"); return; }
    if (physical && pincodeOk !== true) { toast("Please check pincode serviceability"); return; }

    if (payment === "razorpay" || payment === "upi" || payment === "card") {
      const loaded = await loadRazorpay();
      if (!loaded) { toast("Could not load payment gateway. Try COD."); return; }

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!rzpKey) {
        // Demo mode: skip actual payment
        await completeOrder("demo-txn-" + Date.now());
        return;
      }

      // Create Razorpay order via API
      setPlacing(true);
      try {
        const res = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: tot, currency: "INR" }),
        });
        const { orderId: rzpOrderId, error } = await res.json();
        if (error) { toast(error); setPlacing(false); return; }

        const rzp = new window.Razorpay({
          key: rzpKey,
          amount: tot,
          currency: "INR",
          name: "CafeFiro",
          description: "Order payment",
          order_id: rzpOrderId,
          prefill: { name, email, contact: phone },
          handler: async (response: { razorpay_payment_id: string }) => {
            await completeOrder(response.razorpay_payment_id);
          },
          modal: { ondismiss: () => setPlacing(false) },
          theme: { color: "#B0242A" },
        });
        rzp.open();
      } catch (err) {
        toast("Payment failed. Please try again.");
        setPlacing(false);
      }
      return;
    }

    // COD
    setPlacing(true);
    await completeOrder("cod");
  }

  async function completeOrder(txnId: string) {
    const orderId = "CF" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const issuedCodes: string[] = [];

    // Issue gift cards if purchased
    for (const item of items) {
      if (item.type === "gift-card" && item.gift) {
        const code = "CAFE-" + Math.random().toString(36).slice(2, 10).toUpperCase();
        issueGiftCard(code, { balance: item.gift.amount, amount: item.gift.amount, to: item.gift.to, from: item.gift.from, msg: item.gift.msg });
        issuedCodes.push(code);
      }
    }

    // Decrement redeemed gift card
    if (redeemedGiftCode) decrementGiftCard(redeemedGiftCode, Math.min(redeemedGiftAmount, subtotal()));

    // Save address
    if (physical && user && saveAddr) {
      addAddress({ name, phone, line1, city, pincode });
    }

    // Record order
    const orderLines = items.map((item) => {
      if (item.type === "product") {
        const p = PRODUCTS.find((x) => x.handle === item.id);
        return { name: p?.title || item.id, qty: item.qty, price: (p?.price || 0) * item.qty };
      }
      if (item.type === "bundle") {
        const b = BUNDLES.find((x) => x.id === item.id);
        return { name: b?.name || item.id, qty: item.qty, price: (b?.price || 0) * item.qty };
      }
      if (item.type === "sample-kit") return { name: "Sample Kit", qty: 1, price: SAMPLE_KIT_PRICE };
      if (item.type === "gift-card" && item.gift) return { name: `Gift Card → ${item.gift.to}`, qty: 1, price: item.gift.amount };
      return { name: item.id, qty: item.qty, price: 0 };
    });

    saveOrder({
      id: orderId,
      createdAt: new Date().toISOString(),
      items: orderLines,
      total: tot,
      shipping: physical ? { name, phone, address: line1, city, pincode } : null,
      payment: payment === "cod" ? "Cash on Delivery" : "Online Payment",
      issuedGiftCodes: issuedCodes,
    });

    if (user) recordOrder(orderId, tot);

    clearCart();
    setPlacing(false);
    onSuccess(orderId, issuedCodes);
  }

  const addressChips = user?.addresses || [];

  return (
    <Modal open={open} onClose={onClose} className="max-w-3xl" tall>
      <ModalClose onClose={onClose} />
      <div className="grid grid-cols-1 min-[720px]:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="p-6 overflow-y-auto">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl text-ink mb-6">Checkout</h2>

          {!user && (
            <div className="p-3 rounded-[var(--radius)] bg-cream border border-line mb-5 text-sm text-ink-soft">
              <span className="font-semibold text-ink">Log in</span> for faster checkout with saved addresses.
            </div>
          )}

          {/* Saved addresses */}
          {physical && user && addressChips.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-ink-soft uppercase tracking-widest mb-2">Saved addresses</p>
              <div className="flex flex-wrap gap-2">
                {addressChips.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setName(a.name); setPhone(a.phone); setLine1(a.line1); setCity(a.city); setPincode(a.pincode); setPincodeOk(true); }}
                    className="px-3 py-1.5 rounded-full border border-line bg-cream text-xs font-semibold text-ink hover:border-ember transition-colors"
                  >
                    {a.name}, {a.city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-3">
            {[
              { label: "Full name *", value: name, set: setName, type: "text", ph: "Priya Sharma" },
              { label: "Phone *", value: phone, set: setPhone, type: "tel", ph: "+91 98765 43210" },
              { label: "Email *", value: email, set: setEmail, type: "email", ph: "priya@email.com" },
            ].map(({ label, value, set, type, ph }) => (
              <div key={label}>
                <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">{label}</label>
                <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={ph}
                  className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink" />
              </div>
            ))}

            {physical ? (
              <>
                <div>
                  <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Address *</label>
                  <input type="text" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="House / flat, street, area"
                    className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">City *</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai"
                      className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Pincode *</label>
                    <div className="flex gap-2">
                      <input type="text" value={pincode} onChange={(e) => { setPincode(e.target.value); setPincodeOk(null); }}
                        placeholder="400001" maxLength={6}
                        className="flex-1 px-3 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink" />
                      <button onClick={checkPin} className="px-3 py-2 rounded-[var(--radius)] bg-ink text-white font-bold text-xs hover:bg-ink/90 transition-colors whitespace-nowrap">
                        Check
                      </button>
                    </div>
                    {pincodeOk && pincodeOk !== true && <p className="text-xs text-brick mt-1">{pincodeOk}</p>}
                    {pincodeOk === true && <p className="text-xs text-veg mt-1">✓ Serviceable</p>}
                  </div>
                </div>
                {user && (
                  <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                    <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="accent-brick" />
                    Save this address
                  </label>
                )}
              </>
            ) : (
              <div className="p-3 rounded-[var(--radius)] bg-cream/60 border border-line text-sm text-ink-soft">
                🎁 Digital gift card — no shipping address needed. We'll send it by email.
              </div>
            )}

            {/* Payment */}
            <div>
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">Payment method</p>
              <div className="space-y-2">
                {[
                  { id: "upi",  label: "UPI / QR",       sub: "Pay instantly via any UPI app" },
                  { id: "card", label: "Card",            sub: "Visa, Mastercard, RuPay" },
                  ...(!physical ? [] : [{ id: "cod", label: "Cash on Delivery", sub: "Pay in cash when delivered" }]),
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-start gap-3 p-3 rounded-[var(--radius)] border cursor-pointer transition-colors ${payment === opt.id ? "border-brick bg-brick/5" : "border-line hover:border-ink/30"}`}>
                    <input type="radio" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-brick mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-ink">{opt.label}</p>
                      <p className="text-xs text-ink-soft">{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-ink text-cream p-6 min-[720px]:rounded-r-[var(--radius-xl)] flex flex-col">
          <h3 className="font-bold text-lg mb-4">Order summary</h3>
          <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-64">
            {items.map((item) => {
              let name = "", price = 0;
              if (item.type === "product") {
                const p = PRODUCTS.find((x) => x.handle === item.id);
                name = p?.title || ""; price = (p?.price || 0) * item.qty;
              } else if (item.type === "bundle") {
                const b = BUNDLES.find((x) => x.id === item.id);
                name = b?.name || ""; price = (b?.price || 0) * item.qty;
              } else if (item.type === "sample-kit") {
                name = "Sample Kit"; price = SAMPLE_KIT_PRICE;
              } else if (item.type === "gift-card" && item.gift) {
                name = `Gift Card → ${item.gift.to}`; price = item.gift.amount;
              }
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-cream/70 flex-1 pr-2 line-clamp-1">{name} {item.qty > 1 ? `×${item.qty}` : ""}</span>
                  <span className="text-cream font-semibold shrink-0">{formatPrice(price)}</span>
                </div>
              );
            })}
          </div>
          <div className="space-y-2 text-sm border-t border-cream/10 pt-4 mb-4">
            <div className="flex justify-between text-cream/60">
              <span>Subtotal</span><span className="text-cream">{formatPrice(subtotal())}</span>
            </div>
            {couponCode && (
              <div className="flex justify-between text-veg text-xs">
                <span>🏷 {couponCode}</span><span>−{formatPrice(couponDiscount())}</span>
              </div>
            )}
            <div className="flex justify-between text-cream/60 text-xs">
              <span>Shipping</span>
              <span className={shipping() === 0 ? "text-veg" : "text-cream"}>{shipping() === 0 ? "FREE" : formatPrice(shipping())}</span>
            </div>
          </div>
          <div className="flex justify-between font-black text-lg border-t border-cream/10 pt-4 mb-6">
            <span>Total</span><span className="text-ember">{formatPrice(tot)}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full py-4 rounded-full bg-brick text-white font-black text-base hover:bg-brick-deep transition-all disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Place Order · ${formatPrice(tot)}`}
          </button>
          <p className="text-center text-xs text-cream/30 mt-3">🔒 Payments secured by Razorpay</p>
        </div>
      </div>
    </Modal>
  );
}

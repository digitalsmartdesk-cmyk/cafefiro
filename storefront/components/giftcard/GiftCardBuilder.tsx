"use client";
import { useState } from "react";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/catalog";

const DENOMS = [25000, 50000, 100000, 200000];  // paisa

const DESIGNS = [
  { id: "classic", name: "Classic", bg: "linear-gradient(135deg,#B0242A,#C77B2C)" },
  { id: "forest",  name: "Forest",  bg: "linear-gradient(135deg,#234B2E,#5C5A2E)" },
  { id: "festive", name: "Festive", bg: "linear-gradient(135deg,#8E1C20,#C77B2C 70%,#E9C77E)" },
];

interface GiftCardBuilderProps {
  open: boolean;
  onClose: () => void;
  onCartOpen: () => void;
}

export function GiftCardBuilder({ open, onClose, onCartOpen }: GiftCardBuilderProps) {
  const [amount, setAmount]     = useState(50000);
  const [custom, setCustom]     = useState("");
  const [to, setTo]             = useState("");
  const [toEmail, setToEmail]   = useState("");
  const [from, setFrom]         = useState("");
  const [msg, setMsg]           = useState("");
  const [date, setDate]         = useState(new Date().toISOString().slice(0, 10));
  const [design, setDesign]     = useState("classic");
  const [error, setError]       = useState("");

  const addGiftCard = useCartStore((s) => s.addGiftCard);
  const { toast } = useToast();

  const curAmount = custom !== "" ? Math.max(0, Math.min(1000000, parseInt(custom, 10) || 0)) : amount;
  const curDesign = DESIGNS.find((d) => d.id === design) || DESIGNS[0];

  function handleAdd() {
    if (curAmount < 10000) { setError("Minimum gift amount is ₹100"); return; }
    if (!to.trim()) { setError("Please enter the recipient's name"); return; }
    if (!/^\S+@\S+\.\S+$/.test(toEmail)) { setError("Please enter a valid recipient email"); return; }
    setError("");
    addGiftCard({ amount: curAmount, to, toEmail, from: from || "A friend", msg, date, design });
    onClose();
    setTimeout(onCartOpen, 200);
    setTo(""); setToEmail(""); setFrom(""); setMsg(""); setCustom("");
    toast("🎁 Gift card added to cart");
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-3xl" tall>
      <ModalClose onClose={onClose} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {/* Left: preview */}
        <div className="p-6 bg-cream-2 rounded-t-[var(--radius-xl)] sm:rounded-l-[var(--radius-xl)] sm:rounded-tr-none">
          <span className="eyebrow mb-3 block">e-Gift Card</span>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink mb-5">Gift the joy of cooking</h2>
          {/* Card preview */}
          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-lg)] mb-4" style={{ background: curDesign.bg }}>
            <div className="p-5 h-44 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-white/90 font-bold text-sm">CafeFiro</span>
                <span className="text-white/60 text-xs">e-Gift Card</span>
              </div>
              <div className="text-white font-black text-4xl">{curAmount ? formatPrice(curAmount) : "₹—"}</div>
              <div className="flex justify-between text-white/70 text-xs">
                <div><span className="opacity-60">To </span><b className="text-white">{to || "—"}</b></div>
                <div><span className="opacity-60">From </span><b className="text-white">{from || "—"}</b></div>
              </div>
            </div>
          </div>
          {msg && <p className="text-sm text-ink-soft italic mb-4">"{msg}"</p>}
          {/* Design swatches */}
          <div className="flex gap-2">
            {DESIGNS.map((d) => (
              <button key={d.id} onClick={() => setDesign(d.id)}
                className={`flex flex-col items-center gap-1 transition-all ${design === d.id ? "scale-105" : "opacity-60 hover:opacity-80"}`}>
                <span className="w-8 h-8 rounded-full shadow-sm border-2 border-white" style={{ background: d.bg }} />
                <span className="text-xs font-semibold text-ink-soft">{d.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Amount */}
          <div className="mb-4">
            <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-2">Choose amount</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DENOMS.map((d) => (
                <button key={d} onClick={() => { setAmount(d); setCustom(""); }}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${custom === "" && amount === d ? "bg-ink text-white" : "bg-cream-2 text-ink-soft hover:bg-cream-3"}`}>
                  {formatPrice(d)}
                </button>
              ))}
            </div>
            <div className={`flex items-center border rounded-[var(--radius)] overflow-hidden ${custom !== "" ? "border-ember" : "border-line"}`}>
              <span className="px-3 text-ink-soft text-sm bg-cream border-r border-line">₹</span>
              <input type="number" value={custom} onChange={(e) => { setCustom(e.target.value); }}
                placeholder="Custom amount" min={100} max={10000}
                className="flex-1 px-3 py-2.5 bg-cream focus:outline-none text-sm text-ink" />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {[
              { label: "Recipient's name *", value: to,      set: setTo,      type: "text",  ph: "Aunt Meera" },
              { label: "Recipient's email *", value: toEmail, set: setToEmail, type: "email", ph: "aunt@email.com" },
              { label: "Your name",           value: from,    set: setFrom,    type: "text",  ph: "From you" },
            ].map(({ label, value, set, type, ph }) => (
              <div key={label}>
                <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">{label}</label>
                <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={ph}
                  className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Message <span className="font-normal normal-case tracking-normal">(optional, max 140 chars)</span></label>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={140}
                placeholder="Add a personal note…" rows={2}
                className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-ink-soft uppercase tracking-wider block mb-1">Send date</label>
              <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius)] border border-line bg-cream focus:border-ember focus:outline-none text-sm text-ink" />
            </div>
          </div>

          {error && <p className="text-xs text-brick mt-3 bg-brick/5 border border-brick/20 rounded-[var(--radius)] px-3 py-2">{error}</p>}

          <button onClick={handleAdd} className="w-full py-3.5 rounded-full bg-brick text-white font-black hover:bg-brick-deep transition-all mt-4 hover:-translate-y-0.5">
            Add to Cart · {formatPrice(curAmount)}
          </button>
          <p className="text-center text-xs text-ink-soft mt-2">Delivered by email on your chosen date. Valid 12 months.</p>
        </div>
      </div>
    </Modal>
  );
}

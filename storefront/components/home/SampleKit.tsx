"use client";
import Image from "next/image";
import { PRODUCTS, SAMPLE_KIT_PRODUCTS, SAMPLE_KIT_PRICE, formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

export function SampleKit() {
  const addSampleKit = useCartStore((s) => s.addSampleKit);
  const { toast } = useToast();
  const kitProducts = SAMPLE_KIT_PRODUCTS.map((h) => PRODUCTS.find((p) => p.handle === h)!).filter(Boolean);
  const fullValue = kitProducts.reduce((s, p) => s + Math.round(p.price * 0.5), 0);
  const savings = fullValue - SAMPLE_KIT_PRICE;
  const savingsPct = Math.round((savings / fullValue) * 100);

  function handleAdd() {
    addSampleKit();
    toast("🛍 Sample Kit added to cart");
  }

  return (
    <section
      id="kit"
      className="py-20 px-7 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 70% 60% at 80% 30%, #193A2240 0%, transparent 60%), #234B2E" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto grid grid-cols-1 min-[900px]:grid-cols-2 gap-14 items-center">
        {/* Left copy */}
        <div className="reveal">
          <span className="eyebrow mb-4 block text-ember">Sample Kit</span>
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-4xl text-cream tracking-tight mb-5 leading-tight">
            Taste it all for just <span className="text-ember">₹499</span>
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed mb-8">
            8 of our best-selling mixes — each a half-size pack — so you can try every range before committing. Full flavour, half the size.
          </p>
          {/* Price block */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-[family-name:var(--font-display)] font-black text-6xl text-cream">₹499</span>
            <div>
              <span className="text-cream/50 text-sm line-through block">normally {formatPrice(fullValue)}</span>
              <span className="text-veg font-bold text-sm">Save {savingsPct}% · FREE shipping</span>
            </div>
          </div>
          {/* Features */}
          <ul className="space-y-2 mb-8">
            {[
              "8 half-size packs (125–100g each)",
              "FREE shipping, no minimum",
              "Covers all 3 ranges",
              "One-time welcome price",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-cream/80 text-sm font-medium">
                <span className="text-ember">✓</span> {f}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Button variant="ember" size="lg" onClick={handleAdd}>＋ Add Sample Kit · ₹499</Button>
            <a href="#range" className="inline-flex items-center justify-center gap-2 rounded-full font-bold px-8 py-4 text-lg border border-cream/30 text-cream hover:bg-cream/10 transition-all duration-150 hover:-translate-y-0.5">
              Browse individually
            </a>
          </div>
          <p className="text-cream/40 text-xs mt-4">Limited to one per household at this price. While stocks last.</p>
        </div>

        {/* Right: kit box */}
        <div className="relative flex justify-center reveal">
          {/* Box card */}
          <div className="relative bg-cream rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-lg)] max-w-sm w-full rotate-1">
            <div className="absolute -top-3 -right-3 bg-brick text-white text-xs font-black px-4 py-1.5 rounded-full -rotate-6 shadow">
              BEST VALUE
            </div>
            <p className="text-xs font-bold text-ink-soft uppercase tracking-widest mb-4">What's inside</p>
            <div className="grid grid-cols-4 gap-3">
              {kitProducts.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-1">
                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-line bg-paper" style={{ aspectRatio: "1/1.2" }}>
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-ember text-center leading-none">
                    {p.weight === "250g" ? "125g" : "100g"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
              <span className="text-xs text-ink-soft">8 mixes · half sizes</span>
              <span className="font-black text-brick text-lg">₹499</span>
            </div>
          </div>
          {/* "8 for ₹499" ribbon */}
          <div className="absolute -left-4 top-8 bg-ember text-white text-xs font-black px-4 py-2 rounded-r-full shadow -rotate-3">
            8 for ₹499 🎉
          </div>
        </div>
      </div>
    </section>
  );
}

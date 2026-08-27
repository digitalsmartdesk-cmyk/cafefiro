"use client";
import Image from "next/image";
import { BUNDLES, PRODUCTS, formatPrice, bundleValue, productByHandle } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/Toast";

export function Bundles() {
  const addBundle = useCartStore((s) => s.addBundle);
  const { toast } = useToast();

  return (
    <section id="bundles" className="py-20 px-7 max-w-[var(--max-width)] mx-auto">
      <div className="mb-10 reveal">
        <span className="eyebrow mb-3 block">Bundles</span>
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-4xl text-ink tracking-tight mb-3">
          Built for every occasion
        </h2>
        <p className="text-ink-soft text-lg">Curated sets that save more and go further.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BUNDLES.map((b) => {
          const value = bundleValue(b);
          const savings = value - b.price;
          const pct = Math.round((savings / value) * 100);
          const items = b.items.map((h) => productByHandle(h)!).filter(Boolean);

          return (
            <div
              key={b.id}
              className="bg-paper rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] transition-shadow border-l-4 reveal"
              style={{ borderColor: b.accent }}
            >
              {/* Image row */}
              <div className="relative h-40 bg-cream-2 overflow-hidden flex gap-1 p-2">
                {items.slice(0, 3).map((p, i) => (
                  <div key={p.id} className="relative flex-1 rounded-xl overflow-hidden">
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </div>
                ))}
                {/* Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: b.accent }}>
                  {b.items.length} mixes
                </span>
                {b.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-brick text-white">
                    {b.badge}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-base text-ink mb-1">{b.name}</h3>
                <p className="text-xs text-ink-soft mb-3">{b.tagline}</p>
                <ul className="space-y-1 mb-4">
                  {items.map((p) => (
                    <li key={p.id} className="text-xs text-ink-soft flex items-center gap-1.5">
                      <span className="text-veg text-xs">✓</span> {p.title}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-line pt-3">
                  <div>
                    <span className="font-bold text-ink">{formatPrice(b.price)}</span>
                    <span className="text-xs text-ink-soft line-through ml-2">{formatPrice(value)}</span>
                    <div className="text-xs text-veg font-bold">Save {formatPrice(savings)} · {pct}% off</div>
                  </div>
                  <button
                    onClick={() => { addBundle(b.id); toast(`✓ ${b.name} added to cart`); }}
                    className="px-4 py-2 rounded-full font-bold text-sm text-white hover:opacity-90 transition-all hover:-translate-y-0.5"
                    style={{ background: b.accent }}
                  >
                    ＋ Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

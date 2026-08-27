"use client";

interface GiftCardPromoProps {
  onOpen: () => void;
}

const CARD_DESIGNS = [
  { bg: "linear-gradient(135deg,#B0242A,#C77B2C)", rotate: "-rotate-6" },
  { bg: "linear-gradient(135deg,#234B2E,#5C5A2E)", rotate: "rotate-3" },
];

export function GiftCardPromo({ onOpen }: GiftCardPromoProps) {
  return (
    <section id="giftcards" className="py-20 px-7 bg-cream-2">
      <div className="max-w-[var(--max-width)] mx-auto flex flex-col min-[900px]:flex-row items-center gap-14">
        {/* Visual */}
        <div className="relative w-64 h-48 shrink-0">
          {CARD_DESIGNS.map((d, i) => (
            <div
              key={i}
              className={`absolute inset-0 rounded-2xl shadow-[var(--shadow-lg)] ${d.rotate} ${i === 0 ? "top-4 left-4" : ""}`}
              style={{ background: d.bg }}
            >
              <div className="p-5 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-white/90 font-bold text-sm">CafeFiro</span>
                  <span className="text-white/60 text-xs">e-Gift Card</span>
                </div>
                <div className="text-white font-black text-3xl">₹500</div>
              </div>
            </div>
          ))}
        </div>

        {/* Copy */}
        <div className="reveal">
          <span className="eyebrow mb-3 block">Gift Cards</span>
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-4xl text-ink tracking-tight mb-4 leading-tight">
            Gift the joy of cooking
          </h2>
          <p className="text-ink-soft text-lg leading-relaxed mb-6 max-w-md">
            Send a digital gift card in minutes — personalised with a message and your choice of design. Redeemable on any order, valid 12 months.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {["₹250", "₹500", "₹1,000", "₹2,000", "Custom"].map((amt) => (
              <span key={amt} className="px-4 py-1.5 rounded-full bg-cream border border-line text-sm font-bold text-ink">
                {amt}
              </span>
            ))}
          </div>
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white font-bold hover:bg-ink/90 transition-all hover:-translate-y-0.5"
          >
            🎁 Send a Gift Card →
          </button>
        </div>
      </div>
    </section>
  );
}

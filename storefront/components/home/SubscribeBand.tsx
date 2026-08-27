export function SubscribeBand() {
  const chips = [
    { icon: "🔄", text: "Choose 1–3 mixes" },
    { icon: "📅", text: "Pick a frequency" },
    { icon: "💸", text: "Save 15% every order" },
    { icon: "✏️", text: "Change or pause anytime" },
  ];

  const examples = [
    { title: "Soya Galouti Kebab Mix", sub: "Every month", price: "₹211", mrp: "₹249" },
    { title: "Aloo Tikki Mix", sub: "Every 2 weeks", price: "₹152", mrp: "₹179" },
  ];

  return (
    <section
      className="py-20 px-7 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 60% 50% at 80% 50%, #C77B2C15, transparent), #2C2018" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto grid grid-cols-1 min-[900px]:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div className="reveal">
          <span className="eyebrow mb-4 block text-ember">Subscribe & Save</span>
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-4xl text-cream tracking-tight mb-5 leading-tight">
            Never run out. Save <span className="text-ember">15%</span> on every delivery.
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed mb-8">
            Set up a recurring delivery and the discount applies automatically — no codes, no hassle. Skip, pause, or cancel whenever.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {chips.map((c) => (
              <span key={c.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 text-cream text-sm font-semibold border border-cream/15">
                {c.icon} {c.text}
              </span>
            ))}
          </div>
          <a href="#range" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ember text-white font-bold hover:bg-ember-deep transition-all hover:-translate-y-0.5">
            Build my subscription
          </a>
        </div>

        {/* Example cards */}
        <div className="flex flex-col gap-4 reveal">
          {examples.map((e) => (
            <div key={e.title} className="bg-cream/10 border border-cream/15 rounded-[var(--radius-lg)] p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-ember/20 border border-ember/30 flex items-center justify-center text-ember font-bold text-sm">
                🔄
              </div>
              <div className="flex-1">
                <p className="font-bold text-cream text-sm">{e.title}</p>
                <p className="text-cream/50 text-xs">{e.sub}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-ember">{e.price}</p>
                <p className="text-cream/40 text-xs line-through">{e.mrp}</p>
              </div>
            </div>
          ))}
          <p className="text-cream/30 text-xs text-center">Based on one-time prices. Subscribe on any product page.</p>
        </div>
      </div>
    </section>
  );
}

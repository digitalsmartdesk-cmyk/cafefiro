const CLAIMS = [
  "100% Vegetarian",
  "No Preservatives",
  "Ready in 15–20 Minutes",
  "No Artificial Colours",
  "No Artificial Flavours",
  "Made in India",
  "Restaurant Quality",
  "9-Month Shelf Life",
];

export function Marquee() {
  const items = [...CLAIMS, ...CLAIMS];
  return (
    <div className="bg-forest border-t-2 border-ember overflow-hidden py-3">
      <div className="marquee-track flex gap-0 whitespace-nowrap" style={{ width: "max-content" }}>
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-4 pr-8 text-cream font-bold text-sm uppercase tracking-wider">
            {c}
            <span className="text-ember text-lg leading-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

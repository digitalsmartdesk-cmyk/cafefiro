"use client";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  onSampleKit: () => void;
}

const COLLAGE = [
  { src: "/assets/soya-galouti.jpg", rotate: "-rotate-6", z: "z-10" },
  { src: "/assets/paneer-seekh.jpg", rotate: "rotate-3",  z: "z-20" },
  { src: "/assets/aloo-tikki.jpg",   rotate: "-rotate-2", z: "z-10" },
];

const TRUST = [
  { icon: "🥬", text: "100% Vegetarian" },
  { icon: "⚡", text: "Ready in 15–20 min" },
  { icon: "✨", text: "No Preservatives" },
];

export function Hero({ onSampleKit }: HeroProps) {
  return (
    <section
      className="relative min-h-[80vh] flex items-center py-16"
      style={{ background: "radial-gradient(ellipse 80% 60% at 60% 20%, #C77B2C22 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, #234B2E18 0%, transparent 55%), #FAF4E6" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-7 w-full grid grid-cols-1 min-[900px]:grid-cols-[1.05fr_.95fr] gap-16 items-center">
        {/* Left copy */}
        <div className="reveal in">
          <span className="eyebrow mb-5 block">Vegetarian Premixes & Instant Mixes</span>
          <h1
            className="font-[family-name:var(--font-display)] font-extrabold leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)" }}
          >
            Easy to{" "}
            <span className="text-brick">Cook.</span>
            <br />
            Delicious to{" "}
            <span className="text-ember">Share.</span>
          </h1>
          <p className="text-ink-soft text-lg leading-relaxed mb-8 max-w-md">
            Twelve restaurant-style vegetarian mixes — kebabs, bhajiya, tikkis &amp; more — ready in minutes. No preservatives. No artificial colours.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Button variant="primary" size="lg" onClick={onSampleKit}>
              Try the ₹499 Sample Kit
            </Button>
            <a href="#range" className="inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-150 hover:-translate-y-0.5 px-8 py-4 text-lg border border-ink/20 text-ink bg-transparent hover:bg-cream hover:border-ink/40">
              Shop the Range
            </a>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap gap-4">
            {TRUST.map((t) => (
              <span key={t.text} className="flex items-center gap-2 text-sm font-semibold text-ink-soft bg-paper border border-line rounded-full px-4 py-2">
                {t.icon} {t.text}
              </span>
            ))}
          </div>
        </div>

        {/* Right collage */}
        <div className="relative flex items-center justify-center min-h-[420px] hidden min-[900px]:flex">
          {/* Blob */}
          <div className="absolute inset-0 m-auto w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #C77B2C 0%, transparent 70%)" }} />
          {/* Pack images */}
          <div className="relative w-80 h-80">
            {COLLAGE.map((c, i) => (
              <div
                key={c.src}
                className={`absolute ${c.rotate} ${c.z} rounded-2xl overflow-hidden shadow-[var(--shadow-lg)] border-4 border-white`}
                style={{
                  width: 160, height: 190,
                  top: i === 1 ? "50%" : i === 0 ? "10%" : "60%",
                  left: i === 0 ? "0%" : i === 1 ? "30%" : "55%",
                  transform: `rotate(${c.rotate.includes("-") ? "-" : ""}${c.rotate.replace(/[^\d]/g, "")}deg) ${i === 1 ? "translateY(-50%)" : ""}`,
                }}
              >
                <Image src={c.src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
          {/* Stamp */}
          <div
            className="absolute top-4 right-4 w-20 h-20 rounded-full bg-brick text-white flex flex-col items-center justify-center text-center rotate-12 shadow-[var(--shadow)]"
            style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.05em" }}
          >
            <span className="text-lg font-black leading-none">12</span>
            <span>DELICIOUS</span>
            <span>MIXES</span>
          </div>
        </div>
      </div>
    </section>
  );
}

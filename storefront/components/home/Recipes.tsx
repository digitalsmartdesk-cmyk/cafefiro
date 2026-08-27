"use client";
import Image from "next/image";
import { useState } from "react";
import { RECIPES, productByHandle } from "@/lib/catalog";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/Toast";

export function Recipes() {
  const [activeRecipe, setActiveRecipe] = useState<string | null>(null);
  const recipe = RECIPES.find((r) => r.id === activeRecipe);
  const addProduct = useCartStore((s) => s.addProduct);
  const { toast } = useToast();

  return (
    <>
      <section id="recipes" className="py-20 px-7 bg-cream-2">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="mb-10 reveal">
            <span className="eyebrow mb-3 block">Recipes</span>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-4xl text-ink tracking-tight mb-3">
              Cook it your way
            </h2>
            <p className="text-ink-soft text-lg">From sliders to bowls — four recipes to inspire your next meal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RECIPES.map((r) => {
              const p = productByHandle(r.productHandle);
              return (
                <article
                  key={r.id}
                  onClick={() => setActiveRecipe(r.id)}
                  className="bg-paper rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] cursor-pointer group transition-shadow reveal"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image src={r.image} alt={r.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ink/70 text-white text-xs font-bold backdrop-blur-sm">
                      ⏱ {r.time}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-[family-name:var(--font-display)] font-bold text-base text-ink mb-2">{r.title}</h3>
                    <p className="text-xs text-ink-soft leading-relaxed mb-4 line-clamp-2">{r.blurb}</p>
                    <div className="flex items-center justify-between border-t border-line pt-3">
                      <span className="text-xs text-ink-soft">Uses {p?.title?.split(" ").slice(0, 3).join(" ")}</span>
                      <span className="text-xs text-ember font-bold">View recipe →</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recipe overlay */}
      <Modal open={!!recipe} onClose={() => setActiveRecipe(null)} tall>
        {recipe && (() => {
          const p = productByHandle(recipe.productHandle);
          return (
            <>
              <ModalClose onClose={() => setActiveRecipe(null)} />
              <div className="relative h-56 overflow-hidden rounded-t-[var(--radius-xl)]">
                <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="text-xs font-bold opacity-80">CafeFiro Recipes</span>
                  <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl">{recipe.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-5">
                  {[["⏱", recipe.time], ["🍽", `Serves ${recipe.serves}`], ["🥬", "Vegetarian"]].map(([icon, text]) => (
                    <span key={text} className="flex items-center gap-1.5 text-sm text-ink-soft font-semibold">
                      {icon} {text}
                    </span>
                  ))}
                </div>
                <p className="text-ink-soft mb-6">{recipe.blurb}</p>
                {p && (
                  <div className="flex items-center gap-3 p-3 rounded-[var(--radius)] bg-cream border border-line mb-6">
                    <span className="text-sm text-ink-soft">Uses:</span>
                    <span className="font-semibold text-ink text-sm flex-1">{p.title}</span>
                    <button
                      onClick={() => { addProduct(p.handle); toast(`✓ ${p.title} added`); setActiveRecipe(null); }}
                      className="px-4 py-1.5 rounded-full bg-forest text-white font-bold text-xs hover:bg-forest-deep transition-colors"
                    >
                      Add to cart
                    </button>
                  </div>
                )}
                <h3 className="font-bold text-ink mb-3">Method</h3>
                <ol className="space-y-3">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink-soft">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-ember text-white flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          );
        })()}
      </Modal>
    </>
  );
}

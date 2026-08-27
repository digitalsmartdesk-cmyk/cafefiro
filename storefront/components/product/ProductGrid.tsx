"use client";
import { useState, useMemo } from "react";
import { PRODUCTS, Product, ProductCategory } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

type SortKey = "featured" | "popular" | "rating" | "price-asc" | "price-desc";

interface ProductGridProps {
  onOpenPDP: (handle: string) => void;
}

export function ProductGrid({ onOpenPDP }: ProductGridProps) {
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const q = search.trim().toLowerCase();
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    switch (sort) {
      case "popular":   list = [...list].sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "rating":    list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc":list = [...list].sort((a, b) => b.price - a.price); break;
    }
    return list;
  }, [category, search, sort]);

  const cats: Array<ProductCategory | "All"> = ["All", "Kebab Premix", "Instant Mix", "Quick Bites"];

  return (
    <section id="range" className="py-20 px-7 max-w-[var(--max-width)] mx-auto">
      {/* Section header */}
      <div className="mb-10 reveal">
        <span className="eyebrow mb-3 block">Our Range</span>
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-4xl text-ink tracking-tight mb-3">
          Twelve mixes. Endless dinners.
        </h2>
        <p className="text-ink-soft text-lg max-w-xl">
          From smoky kebabs to crispy bhajiya — authentic Indian flavours, ready in minutes. All 100% vegetarian, no preservatives.
        </p>
      </div>

      {/* Range bar */}
      <div className="flex flex-col min-[900px]:flex-row min-[900px]:items-center justify-between gap-4 mb-5 reveal">
        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                category === c
                  ? "bg-ink text-white"
                  : "bg-cream-2 text-ink-soft hover:bg-cream-3"
              }`}
            >
              {c === "All" ? "All Products" : c}
            </button>
          ))}
        </div>
        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm">🔍</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mixes…"
              className="pl-8 pr-4 py-2 rounded-full bg-cream-2 border border-transparent focus:border-ember focus:outline-none text-sm w-48 text-ink placeholder:text-ink-soft/60"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-4 py-2 rounded-full bg-cream-2 border border-transparent focus:border-ember focus:outline-none text-sm text-ink cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="popular">Most popular</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-ink-soft mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-soft">
          <p className="text-2xl mb-2">🥲</p>
          <p>No products match your search.</p>
          <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-4 text-sm text-ember underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 min-[900px]:grid-cols-3 min-[1080px]:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpenPDP} />
          ))}
        </div>
      )}
    </section>
  );
}

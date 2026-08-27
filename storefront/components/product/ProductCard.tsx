"use client";
import Image from "next/image";
import { Product, formatPrice, discountPct } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { StarRating } from "@/components/ui/StarRating";
import { useToast } from "@/components/ui/Toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onOpen: (handle: string) => void;
}

export function ProductCard({ product: p, onOpen }: ProductCardProps) {
  const addProduct = useCartStore((s) => s.addProduct);
  const { toggleWishlist, inWishlist } = useAuthStore();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const wishlisted = inWishlist(p.handle);
  const pct = discountPct(p.price, p.mrp);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addProduct(p.handle);
    setAdded(true);
    toast(`✓ ${p.title} added to cart`);
    setTimeout(() => setAdded(false), 1600);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    toggleWishlist(p.handle);
    toast(wishlisted ? "Removed from wishlist" : "❤️ Saved to wishlist");
  }

  return (
    <article
      onClick={() => onOpen(p.handle)}
      className="bg-paper rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] overflow-hidden cursor-pointer group transition-shadow reveal"
    >
      {/* Image */}
      <div className="relative bg-cream overflow-hidden" style={{ aspectRatio: "644/768" }}>
        <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* Category tag */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-paper/90 backdrop-blur-sm text-xs font-bold text-ink-soft border border-line">
          {p.category}
        </span>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-[var(--shadow-sm)] transition-colors text-base ${wishlisted ? "bg-brick text-white" : "bg-paper/90 text-ink-soft hover:bg-paper"}`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-display)] font-bold text-base text-ink leading-tight mb-1">{p.title}</h3>
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={p.rating} />
          <span className="text-xs font-semibold text-ember">{p.rating}</span>
          <span className="text-xs text-ink-soft">· {p.reviewCount} reviews</span>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed mb-4 line-clamp-2">{p.subtitle}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-ink text-base">{formatPrice(p.price)}</span>
            {pct > 0 && (
              <>
                <span className="text-ink-soft text-xs line-through ml-2">{formatPrice(p.mrp)}</span>
                <span className="text-veg text-xs font-bold ml-1">{pct}% off</span>
              </>
            )}
            <div className="text-xs text-ink-soft">{p.weight}</div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest text-white font-bold text-sm hover:bg-forest-deep transition-all hover:-translate-y-0.5 active:scale-95"
          >
            {added ? "✓" : "＋"} {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

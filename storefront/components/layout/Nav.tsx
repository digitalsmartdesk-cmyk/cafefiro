"use client";
import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/auth-store";

interface NavProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onAccountOpen: () => void;
}

export function Nav({ onCartOpen, onAuthOpen, onAccountOpen }: NavProps) {
  const count = useCartStore((s) => s.count)();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = [
    { label: "Our Range", href: "#range" },
    { label: "Bundles", href: "#bundles" },
    { label: "₹499 Sample Kit", href: "#kit" },
    { label: "Recipes", href: "#recipes" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-line h-[74px] flex items-center">
      <div className="w-full max-w-[var(--max-width)] mx-auto px-7 flex items-center gap-6">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <Image src="/assets/logo.png" alt="CafeFiro" height={44} width={140} className="h-11 w-auto" priority />
        </a>

        {/* Nav links */}
        <nav className="hidden min-[900px]:flex items-center gap-6 ml-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-ink-soft hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-3">
          {/* Veg badge */}
          <span className="hidden min-[560px]:flex items-center gap-1.5 px-3 py-1 rounded-full border border-veg/30 bg-veg/10 text-veg text-xs font-bold">
            <span className="w-3 h-3 rounded-sm border-2 border-veg flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-veg" />
            </span>
            100% VEG
          </span>

          {/* Account */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-line bg-paper hover:bg-cream transition-colors text-sm font-semibold"
              >
                <span className="w-7 h-7 rounded-full bg-brick text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                <span className="text-xs text-ink-soft">▾</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-paper rounded-[var(--radius)] shadow-[var(--shadow-lg)] border border-line py-1 z-50">
                  {[
                    { label: "My Account", action: () => { onAccountOpen(); setDropdownOpen(false); } },
                    { label: "My Orders", action: () => { onAccountOpen(); setDropdownOpen(false); } },
                    { label: "Wishlist", action: () => { onAccountOpen(); setDropdownOpen(false); } },
                    { label: "Refer & Earn", action: () => { onAccountOpen(); setDropdownOpen(false); } },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-cream transition-colors">
                      {item.label}
                    </button>
                  ))}
                  <hr className="my-1 border-line" />
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-brick hover:bg-cream transition-colors">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={onAuthOpen}>Log in</Button>
          )}

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-white text-sm font-bold hover:bg-ink/90 transition-colors relative"
          >
            🛒 Cart
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brick text-white text-xs font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

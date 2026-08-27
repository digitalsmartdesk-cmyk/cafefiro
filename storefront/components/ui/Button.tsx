import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ember" | "ghost" | "cream" | "forest";
type Size    = "sm" | "md" | "lg" | "block";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brick text-white hover:bg-brick-deep active:scale-[.98]",
  ember:   "bg-ember text-white hover:bg-ember-deep active:scale-[.98]",
  ghost:   "border border-ink/20 text-ink bg-transparent hover:bg-cream hover:border-ink/40",
  cream:   "bg-cream-2 text-ink hover:bg-cream-3",
  forest:  "bg-forest text-white hover:bg-forest-deep active:scale-[.98]",
};

const sizeClasses: Record<Size, string> = {
  sm:    "px-4 py-2 text-sm",
  md:    "px-6 py-3 text-base",
  lg:    "px-8 py-4 text-lg",
  block: "px-6 py-3 text-base w-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold",
        "transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

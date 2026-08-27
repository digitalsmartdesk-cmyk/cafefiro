"use client";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** whether to fill most of the viewport vertically (for large overlays) */
  tall?: boolean;
}

export function Modal({ open, onClose, children, className = "", tall = false }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="scrim open fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative bg-paper rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-auto max-h-[90vh] w-full max-w-2xl ${tall ? "max-h-[94vh]" : ""} ${className}`}
        style={{ animation: "modalIn .22s cubic-bezier(.34,1.4,.64,1)" }}
      >
        {children}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform: scale(.94) translateY(16px); } }`}</style>
    </div>
  );
}

export function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-soft hover:bg-cream-2 transition-colors text-sm font-semibold"
      aria-label="Close"
    >
      ✕
    </button>
  );
}

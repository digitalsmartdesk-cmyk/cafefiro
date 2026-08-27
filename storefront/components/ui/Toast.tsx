"use client";
import { useEffect, useRef, createContext, useContext, useState, useCallback } from "react";

interface ToastItem { id: string; message: string; }

interface ToastCtx { toast: (msg: string) => void; }
const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.map((x) => x.id === id ? { ...x, leaving: true } as ToastItem : x));
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 220);
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }

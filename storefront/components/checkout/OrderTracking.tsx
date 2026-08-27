"use client";
import { Modal, ModalClose } from "@/components/ui/Modal";
import { getOrders } from "@/lib/utils";

interface OrderTrackingProps {
  orderId: string | null;
  onClose: () => void;
}

const STAGES = [
  { id: "confirmed",    label: "Order Confirmed",     icon: "✓", hours: 0 },
  { id: "packed",       label: "Packed",               icon: "📦", hours: 18 },
  { id: "shipped",      label: "Shipped",              icon: "🚛", hours: 36 },
  { id: "out",          label: "Out for Delivery",     icon: "🛵", hours: 84 },
  { id: "delivered",    label: "Delivered",            icon: "🎉", hours: 108 },
];

export function OrderTracking({ orderId, onClose }: OrderTrackingProps) {
  const order = orderId ? getOrders().find((o) => o.id === orderId) : null;
  if (!order) return null;

  const hoursElapsed = (Date.now() - new Date(order.createdAt).getTime()) / 36e5;
  const currentStageIdx = STAGES.reduce((idx, s, i) => (hoursElapsed >= s.hours ? i : idx), 0);

  const stageTime = (idx: number) => {
    const ts = new Date(new Date(order.createdAt).getTime() + STAGES[idx].hours * 36e5);
    return ts.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const eta = new Date(new Date(order.createdAt).getTime() + 7 * 24 * 36e5)
    .toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Modal open={!!order} onClose={onClose}>
      <ModalClose onClose={onClose} />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="eyebrow mb-1 block">Order tracking</span>
            <h2 className="font-[family-name:var(--font-display)] font-bold text-xl text-ink">{order.id}</h2>
            <p className="text-sm text-ink-soft">Expected by {eta}</p>
          </div>
          <div className="text-right text-xs text-ink-soft">
            <p>Delhivery Express</p>
            <p className="font-mono">AWB: DEL{order.id.slice(-8)}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 mb-6">
          {/* Progress line */}
          <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-line" />
          <div
            className="absolute left-3.5 top-3 w-0.5 bg-brick transition-all duration-700"
            style={{ height: `${(currentStageIdx / (STAGES.length - 1)) * 100}%` }}
          />

          <div className="space-y-6">
            {STAGES.map((stage, i) => {
              const done    = i < currentStageIdx;
              const current = i === currentStageIdx;
              const future  = i > currentStageIdx;
              return (
                <div key={stage.id} className="flex items-start gap-3">
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 z-10 transition-all ${
                    done    ? "bg-veg border-veg text-white" :
                    current ? "bg-brick border-brick text-white animate-pulse" :
                    "bg-paper border-line text-ink-soft"
                  }`}>
                    {done ? "✓" : stage.icon}
                  </div>
                  <div className={future ? "opacity-40" : ""}>
                    <p className={`font-bold text-sm ${current ? "text-brick" : done ? "text-ink" : "text-ink-soft"}`}>
                      {stage.label}
                    </p>
                    {(done || current) && (
                      <p className="text-xs text-ink-soft">{stageTime(i)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-line pt-4 mb-4">
          <p className="text-xs font-bold text-ink-soft uppercase tracking-widest mb-2">Shipment items</p>
          <ul className="space-y-1">
            {order.items.map((item) => (
              <li key={item.name} className="text-sm text-ink-soft flex justify-between">
                <span>{item.name} {item.qty > 1 ? `×${item.qty}` : ""}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://wa.me/919667395420"
          target="_blank" rel="noopener"
          className="flex items-center justify-center gap-2 py-3 rounded-full border border-whatsapp text-whatsapp font-bold text-sm hover:bg-whatsapp hover:text-white transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Need help? Chat on WhatsApp
        </a>
      </div>
    </Modal>
  );
}

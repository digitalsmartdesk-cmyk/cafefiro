"use client";
import { useState, useEffect } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SampleKit } from "@/components/home/SampleKit";
import { Bundles } from "@/components/home/Bundles";
import { SubscribeBand } from "@/components/home/SubscribeBand";
import { Recipes } from "@/components/home/Recipes";
import { GiftCardPromo } from "@/components/home/GiftCardPromo";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { OrderSuccess } from "@/components/checkout/OrderSuccess";
import { OrderTracking } from "@/components/checkout/OrderTracking";
import { AuthModal } from "@/components/auth/AuthModal";
import { AccountModal } from "@/components/auth/AccountModal";
import { GiftCardBuilder } from "@/components/giftcard/GiftCardBuilder";
import { CouponsModal } from "@/components/coupons/CouponsModal";
import { PDP } from "@/components/product/PDP";
import { ContentOverlay } from "@/components/content/ContentOverlay";
import { useCartStore } from "@/lib/cart-store";
import { seedDemoGiftCard } from "@/lib/utils";

type OverlayState = {
  cart: boolean;
  checkout: boolean;
  auth: boolean;
  account: boolean;
  giftBuilder: boolean;
  coupons: boolean;
  couponsContinue: boolean;
  pdp: string | null;
  content: string | null;
  success: boolean;
  successOrderId: string;
  successCodes: string[];
  tracking: string | null;
};

export default function Home() {
  const [ui, setUi] = useState<OverlayState>({
    cart: false,
    checkout: false,
    auth: false,
    account: false,
    giftBuilder: false,
    coupons: false,
    couponsContinue: false,
    pdp: null,
    content: null,
    success: false,
    successOrderId: "",
    successCodes: [],
    tracking: null,
  });

  const subtotal = useCartStore((s) => s.subtotal)();

  // Scroll reveal observer
  useEffect(() => {
    seedDemoGiftCard();
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const set = (patch: Partial<OverlayState>) => setUi((s) => ({ ...s, ...patch }));

  function handleCheckoutClick() {
    set({ cart: false });
    setTimeout(() => set({ coupons: true, couponsContinue: true }), 200);
  }

  function handleCouponsContinue() {
    set({ coupons: false, couponsContinue: false });
    setTimeout(() => set({ checkout: true }), 260);
  }

  function handleOrderSuccess(orderId: string, issuedCodes: string[]) {
    set({ checkout: false, success: true, successOrderId: orderId, successCodes: issuedCodes });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Nav
        onCartOpen={() => set({ cart: true })}
        onAuthOpen={() => set({ auth: true })}
        onAccountOpen={() => set({ account: true })}
      />

      <main className="flex-1">
        <Hero onSampleKit={() => { useCartStore.getState().addSampleKit(); set({ cart: true }); }} />
        <Marquee />
        <ProductGrid onOpenPDP={(handle) => set({ pdp: handle })} />
        <SampleKit />
        <Bundles />
        <SubscribeBand />
        <Recipes />
        <GiftCardPromo onOpen={() => set({ giftBuilder: true })} />
      </main>

      <Footer
        onPageOpen={(page) => set({ content: page })}
        onPerksOpen={() => set({ coupons: true, couponsContinue: false })}
      />

      <WhatsAppFab />

      {/* All overlays */}
      <CartDrawer
        open={ui.cart}
        onClose={() => set({ cart: false })}
        onCheckout={handleCheckoutClick}
      />
      <CheckoutModal
        open={ui.checkout}
        onClose={() => set({ checkout: false })}
        onSuccess={handleOrderSuccess}
      />
      <OrderSuccess
        open={ui.success}
        orderId={ui.successOrderId}
        issuedCodes={ui.successCodes}
        onClose={() => set({ success: false })}
        onTrackOrder={(id) => set({ success: false, tracking: id })}
      />
      <OrderTracking
        orderId={ui.tracking}
        onClose={() => set({ tracking: null })}
      />
      <AuthModal
        open={ui.auth}
        onClose={() => set({ auth: false })}
      />
      <AccountModal
        open={ui.account}
        onClose={() => set({ account: false })}
        onTrackOrder={(id) => set({ account: false, tracking: id })}
      />
      <GiftCardBuilder
        open={ui.giftBuilder}
        onClose={() => set({ giftBuilder: false })}
        onCartOpen={() => set({ cart: true })}
      />
      <CouponsModal
        open={ui.coupons}
        onClose={() => set({ coupons: false, couponsContinue: false })}
        cartSubtotal={subtotal}
        onContinue={ui.couponsContinue ? handleCouponsContinue : undefined}
        isInterstitial={ui.couponsContinue}
      />
      <PDP
        handle={ui.pdp}
        onClose={() => set({ pdp: null })}
        onCartOpen={() => set({ cart: true })}
      />
      <ContentOverlay
        page={ui.content}
        onClose={() => set({ content: null })}
      />
    </div>
  );
}

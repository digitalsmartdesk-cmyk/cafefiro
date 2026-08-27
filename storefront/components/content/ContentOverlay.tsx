"use client";
import { Modal, ModalClose } from "@/components/ui/Modal";

interface ContentPage {
  title: string;
  html: string;
}

const PAGES: Record<string, ContentPage> = {
  about: {
    title: "Our Story",
    html: `<p>CafeFiro began with a simple belief — that the joy of a perfectly spiced kebab shouldn't be reserved for restaurants or hours of prep.</p>
    <p>We bottled the technique: authentic recipes, slow-ground spices, and clean vegetarian ingredients, ready the moment you are. No added preservatives. No artificial colours or flavours. Just honest mixes that turn a busy weeknight into something worth gathering around.</p>
    <p><b>Easy to cook. Delicious to share.</b> That's not just our tagline — it's the whole point.</p>`,
  },
  contact: {
    title: "Contact Us",
    html: `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:20px">
      <a href="https://wa.me/919667395420" target="_blank" rel="noopener" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px;border-radius:12px;border:1px solid #E3D5B8;text-decoration:none;color:inherit">
        <span style="font-size:24px">💬</span><b>WhatsApp</b><span style="font-size:13px;color:#5A4A3C">+91 96673 95420</span>
      </a>
      <a href="mailto:hello@cafefiro.in" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px;border-radius:12px;border:1px solid #E3D5B8;text-decoration:none;color:inherit">
        <span style="font-size:24px">✉️</span><b>Email</b><span style="font-size:13px;color:#5A4A3C">hello@cafefiro.in</span>
      </a>
      <a href="tel:+919667395420" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px;border-radius:12px;border:1px solid #E3D5B8;text-decoration:none;color:inherit">
        <span style="font-size:24px">📞</span><b>Call / Care</b><span style="font-size:13px;color:#5A4A3C">Mon–Sat, 10am–7pm</span>
      </a>
    </div>
    <p><b>Registered office:</b><br>CafeFiro Foods Pvt. Ltd.<br>Unit 4, Food Park, Andheri East,<br>Mumbai, Maharashtra 400093, India</p>
    <p><b>FSSAI Lic. No.:</b> 10020031000000 &nbsp;·&nbsp; <b>GSTIN:</b> 27ABCDE1234F1Z5</p>`,
  },
  shipping: {
    title: "Shipping Policy",
    html: `<p>We ship across India through trusted courier partners.</p>
    <ul>
      <li><b>Dispatch:</b> Orders are dispatched within 24–48 hours (excluding Sundays & holidays).</li>
      <li><b>Delivery time:</b> Typically 3–7 working days. Check your pincode at checkout for an estimate.</li>
      <li><b>Shipping charge:</b> Flat ₹49. <b>FREE</b> on all orders above ₹399 and on the Sample Kit.</li>
      <li><b>Tracking:</b> You'll receive an SMS & email with a tracking link once your order ships.</li>
    </ul>`,
  },
  returns: {
    title: "Returns & Refunds",
    html: `<p>Because our products are food items, we cannot accept returns once delivered. Your satisfaction matters, so:</p>
    <ul>
      <li>If you receive a <b>damaged, leaking, or expired</b> pack, share an unboxing photo within <b>48 hours</b> of delivery.</li>
      <li>We'll arrange a <b>free replacement</b> or a <b>full refund</b> to your original payment method.</li>
      <li>Refunds are processed within <b>5–7 working days</b> of approval.</li>
      <li>Wrong item delivered? We'll replace it at no extra cost.</li>
    </ul>
    <p>Write to <b>hello@cafefiro.in</b> or WhatsApp us with your order ID to start a claim.</p>`,
  },
  privacy: {
    title: "Privacy Policy",
    html: `<p>We respect your privacy and collect only what we need to fulfil your order.</p>
    <ul>
      <li><b>What we collect:</b> name, contact details, and delivery address.</li>
      <li><b>How we use it:</b> to process orders, deliver products, and (with consent) send offers.</li>
      <li><b>What we never do:</b> sell your data. Payment details are handled by secure, PCI-compliant gateways and never stored by us.</li>
      <li><b>Your rights:</b> request access to or deletion of your data anytime at hello@cafefiro.in.</li>
    </ul>`,
  },
  terms: {
    title: "Terms of Service",
    html: `<p>By using this website and placing an order, you agree to the following:</p>
    <ul>
      <li>Prices and offers are subject to change without notice.</li>
      <li>The Sample Kit is limited to one per household at the introductory price.</li>
      <li>We reserve the right to cancel orders in case of pricing errors or stock issues, with a full refund.</li>
      <li>Product images are representational; cooked results may vary.</li>
      <li>All content and trademarks belong to CafeFiro Foods Pvt. Ltd.</li>
    </ul>`,
  },
  faq: {
    title: "Frequently Asked Questions",
    html: `<dl class="faq-list">
      ${[
        ["How do I cook CafeFiro mixes?", "Just add water (or curd for some kebabs), mix into a dough or batter, shape, and shallow-fry, air-fry or deep-fry as printed on the pack. Most products are ready in 15–20 minutes."],
        ["Are all products 100% vegetarian?", "Yes. Every CafeFiro product is 100% vegetarian, with no added preservatives, artificial colours or flavours."],
        ["What is the shelf life?", "Our mixes stay fresh for 9 months from manufacture when stored in a cool, dry place. Check the date stamp on the back of the pouch."],
        ["Do you deliver across India?", "Yes, we ship pan-India. Enter your pincode at checkout to see delivery time and COD availability."],
        ["Is Cash on Delivery available?", "COD is available on most pincodes. You can confirm it during the pincode check at checkout."],
      ].map(([q, a]) => `<div class="faq-item" style="margin-bottom:12px"><dt style="font-weight:700;cursor:pointer;padding:12px;background:#FAF4E6;border-radius:10px;border:1px solid #E3D5B8">${q}</dt><dd style="padding:12px 12px 0;font-size:14px;color:#5A4A3C">${a}</dd></div>`).join("")}
    </dl>`,
  },
};

interface ContentOverlayProps {
  page: string | null;
  onClose: () => void;
}

export function ContentOverlay({ page, onClose }: ContentOverlayProps) {
  const content = page ? PAGES[page] : null;
  if (!content) return null;

  return (
    <Modal open={!!content} onClose={onClose} tall>
      <ModalClose onClose={onClose} />
      <div className="p-6 overflow-y-auto max-h-[80vh]">
        <span className="eyebrow mb-3 block">CafeFiro</span>
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-3xl text-ink mb-6">{content.title}</h2>
        <div
          className="prose prose-sm max-w-none text-ink-soft"
          style={{
            lineHeight: 1.7,
          }}
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      </div>
    </Modal>
  );
}

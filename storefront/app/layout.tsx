import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CafeFiro — Easy to Cook. Delicious to Share.",
  description: "100% vegetarian cooking premixes & instant mixes — kebabs, tikkis, bhajiya & more. Ready in 15–20 minutes. No preservatives.",
  keywords: ["vegetarian premix", "kebab mix", "instant snack mix", "Indian food", "cafefiro"],
  openGraph: {
    title: "CafeFiro — Easy to Cook. Delicious to Share.",
    description: "12 vegetarian mixes. Restaurant quality. Ready in minutes.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${hanken.variable}`}>
      <body className="min-h-screen flex flex-col antialiased" style={{ fontFamily: "var(--font-body)" }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

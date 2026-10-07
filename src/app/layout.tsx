import type { Metadata, Viewport } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";

const display = Cormorant({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-body" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: `${s.brand_name} — ${s.tagline}`, template: `%s | ${s.brand_name}` },
    description: `${s.brand_name}: premium clothing designed in Colombo, Sri Lanka. Island-wide delivery and cash on delivery.`,
  };
}

export const viewport: Viewport = { themeColor: "#1c1917" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { business } from "@/content/business";
import { siteUrl } from "@/lib/site-url";
import { body, display, script } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.name}: ${business.tagline}`, template: `%s · ${business.name}` },
  description: business.description,
  openGraph: { type: "website", siteName: business.name, locale: "mn_MN", images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#ffdde4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-cocoa focus:px-4 focus:py-2 focus:text-milk">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

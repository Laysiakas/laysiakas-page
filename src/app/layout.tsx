import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "../components/ui/cart-context";
import CartButton from "../components/ui/cart-button";




const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laysiakas",
  description: "Kuriu greitas ir modernias e-shop svetaines su Next.js, Tailwind ir shadcn/ui.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" className="dark">
      <head>
        <link rel="icon" href="/favicon-2025.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground`}>
        <CartProvider>
          <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
              <Link href="/" className="text-sm font-semibold tracking-wide">laysiakas</Link>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/shop" className="rounded-xl px-3 py-1.5 text-sm border hover:bg-white/10">E-shop demo</Link>
                <Link href="/services" className="rounded-xl px-3 py-1.5 text-sm border hover:bg-white/10">Paslaugos</Link>
                <Link href="/cafe" className="rounded-xl px-3 py-1.5 text-sm border hover:bg-white/10">Kavinė</Link>
                <CartButton />
              </div>
            </nav>
          </header>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

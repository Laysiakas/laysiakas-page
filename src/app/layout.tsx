import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { CartProvider } from "@/components/ui/cart-context";
import CartButton from "@/components/ui/cart-button";
import { Button } from "@/components/ui/button";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laysiakas",
  description:
    "Kuriu greitas ir modernias e-shop svetaines su Next.js, Tailwind ir shadcn/ui.",
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

      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground`}
      >
        <CartProvider>
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto w-full max-w-6xl px-3 md:px-4">
              <nav className="flex items-center gap-2 py-3 md:py-4 overflow-x-auto no-scrollbar">
                <Link href="/" className="shrink-0 font-semibold">
                  laysiakas
                </Link>

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    asChild
                    className="rounded-xl px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base"
                  >
                    <Link href="/shop">E-shop demo</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base"
                  >
                    <Link href="/services">Paslaugos</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base"
                  >
                    <Link href="/cafe">Kavinė</Link>
                  </Button>

                  <CartButton />
                </div>
              </nav>
            </div>
          </header>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}

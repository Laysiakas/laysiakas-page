import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laysiakas",
  description: "Kuriu greitas ir modernias e-shop svetaines.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" className="dark">
      <body>{children}</body>
    </html>
  );
}


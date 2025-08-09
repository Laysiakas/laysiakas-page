import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
<nav className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-900">
  <a href="/shop">Shop</a>
  <a href="/services">Services</a>
  <a href="/cafe">Cafe</a>
</nav>
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Laysiakas',
  description: 'Kuriu greitas ir modernias e-shop svetaines su Next.js, Tailwind ir shadcn/ui.',
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
      <body>{children}</body>
    </html>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "E-shop demo" },
  { href: "/services", label: "Paslaugos" },
];

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <span className="text-sm font-semibold tracking-wide">laysiakas</span>
        <div className="ml-auto flex items-center gap-2">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-1.5 text-sm transition ${
                  active ? "bg-white text-black" : "border hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

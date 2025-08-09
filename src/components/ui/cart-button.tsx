"use client";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartButton() {
  const { items } = useCart();
  const count = items.reduce((a, b) => a + b.qty, 0);
  return (
    <Link href="/checkout" className="relative rounded-xl px-3 py-1.5 text-sm border hover:bg-white/10">
      Krepšelis
      {count > 0 && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-black text-xs px-1">
          {count}
        </span>
      )}
    </Link>
  );
}

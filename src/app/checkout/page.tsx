"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/ui/cart-context"; // adjust path if needed

function eur(v: number) {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(v);
}

export default function CheckoutPage() {
  const { items, removeOne, removeLine, clear } = useCart();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/shop" className="text-sm underline text-muted-foreground">← Grįžti į katalogą</Link>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Krepšelis</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Krepšelis tuščias. <Link className="underline" href="/shop">Grįžti į katalogą</Link>
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-800">
            {items.map((i) => (
              <li key={`${i.sku}-${i.size}`} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-12 overflow-hidden rounded border">
                  <Image src={i.image} alt={i.title} fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-muted-foreground">Dydis: {i.size}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeOne(i.sku, i.size)}
                    className="h-8 w-8 rounded-md border hover:bg-white/10"
                    title="Sumažinti kiekį"
                  >
                    −
                  </button>
                  <div className="w-8 text-center">{i.qty}</div>
                  <button
                    onClick={() => removeLine(i.sku, i.size)}
                    className="h-8 w-8 rounded-md border hover:bg-white/10"
                    title="Pašalinti eilutę"
                  >
                    ×
                  </button>
                </div>

                <div className="w-24 text-right font-medium">{eur(i.price * i.qty)}</div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg font-semibold">Iš viso: {eur(total)}</div>
            <button className="px-4 py-2 rounded-xl bg-white text-black">Tęsti apmokėjimą (demo)</button>
          </div>

          <div className="mt-4">
            <button className="text-sm underline text-muted-foreground" onClick={clear}>Išvalyti krepšelį</button>
          </div>
        </>
      )}
    </main>
  );
}

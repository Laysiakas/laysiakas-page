import Image from "next/image";
import Link from "next/link";
import { getProductBySku } from "@/lib/products";
import BuyClient from "./buy-client";

export const dynamic = "force-dynamic";

function fmtEUR(v: number) {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(v);
}

export default async function ProductPage({ params }: { params: { sku: string } }) {
  const item = await getProductBySku(params.sku);
  if (!item) {
    return (
       <main className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div className="md:col-span-2 mb-4">
        <Link href="/shop" className="text-sm underline text-muted-foreground">← Grįžti</Link>
      </div>
      </main>
    );
  }

  const points = [
    "Audinys: premium kokybė (minkštas, kvėpuojantis)",
    "Pagaminta iš 95% poliesterio, 5% elastano",
    "Švelni pamušalo dalis, patogi kasdien",
  ];
  const measurements = [
    { label: "Krūtinė", value: "88–92 cm" },
    { label: "Liemuo", value: "68–72 cm" },
    { label: "Klubai", value: "94–98 cm" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div className="relative w-full overflow-hidden rounded-2xl border">
        <div className="relative aspect-[3/4]">
          <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>

      <section>
        <h1 className="text-3xl font-semibold">{item.title}</h1>
        <div className="mt-2 text-muted-foreground">SKU: {item.sku}</div>
        <div className="mt-4 text-2xl font-bold">{fmtEUR(item.priceEUR)}</div>

        <BuyClient product={{ sku: item.sku, title: item.title, price: item.priceEUR, image: item.image, sizes: item.sizes }} />

        <div className="mt-8">
          <h2 className="text-lg font-medium mb-2">Aprašymas</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2">Išmatavimai</h3>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            {measurements.map((m) => (
              <div key={m.label} className="rounded-xl border p-3">
                <dt className="text-muted-foreground">{m.label}</dt>
                <dd className="font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8">
          <Link href="/shop" className="px-4 py-2 rounded-xl border">Atgal</Link>
        </div>
      </section>
    </main>
  );
}

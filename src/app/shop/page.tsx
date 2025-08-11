// app/shop/page.tsx
// LT: Šis puslapis generuojamas statikai ir atsinaujina fone kas 1 val.
// Jei nori visiškos statikos demo, gali vietoje to naudoti: export const dynamic = "force-static";
export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";

// (nebūtina, bet patogu tipams)
type Product = {
  sku: string;
  title: string;
  image: string;      // pvz. "/products/ABC-Kelnės-29.99-SML.webp"
  sizes: string[];    // pvz. ["S","M","L"]
  priceEUR: number;   // pvz. 29.99
};

function fmtEUR(v: number) {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(v);
}

export default async function ShopPage() {
  const products: Product[] = await getProducts();

  return (
    <main className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-10 overflow-auto no-scrollbar">
      <header className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Produktų katalogas</h1>
        <Link href="/" className="underline text-sm md:text-base">
          ← pradžia
        </Link>
      </header>

      {products.length === 0 ? (
        <p className="text-sm md:text-base text-muted-foreground">
          Įkelk nuotraukas į <code>/public/products</code> formatu: <br />
          <code>SKU-Pavadinimas-29.99-SML.jpg</code>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.map((p, i) => {
            const isFirst = i === 0; // LT: LCP kandidatas (pirmoji kortelė virš „fold’o“)
            return (
              <Link
                key={p.sku}
                href={`/product/${p.sku}`}
                className="block rounded-xl md:rounded-2xl border hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    // LT: dydžių taisyklė pagal tavo grid (1/2/3 stulpai):
                    // ≥1024px ~33vw, ≥640px ~50vw, kitaip 100vw
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    // LT: LCP optimizacija — tik pirma kortelė „eager/priority/high“
                    priority={isFirst}
                    loading={isFirst ? "eager" : "lazy"}
                    fetchPriority={isFirst ? "high" : "auto"}
                    className="object-cover"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h2 className="text-base md:text-lg font-semibold">{p.title}</h2>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Dydžiai: {p.sizes.join("/")}
                  </p>
                  <div className="mt-1 text-sm md:text-base font-medium">
                    {fmtEUR(p.priceEUR)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

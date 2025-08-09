import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";

function fmtEUR(v: number) {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(v);
}

export default async function ShopPage() {
  const products = await getProducts();

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
          {products.map((p) => (
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
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
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
          ))}
        </div>
      )}
    </main>
  );
}

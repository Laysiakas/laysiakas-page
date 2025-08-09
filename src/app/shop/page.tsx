import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";

function fmtEUR(v: number) {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(v);
}

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Produktų katalogas</h1>
        <Link href="/" className="underline">Į pradžią</Link>
      </header>
      {products.length === 0 ? (
        <p className="text-muted-foreground">Įkelk nuotraukas į <code>/public/products</code> tokiu formatu: <code>SKU--Pavadinimas--29.99--SML.jpg</code></p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link key={p.sku} href={`/product/${p.sku}`} className="block rounded-2xl border hover:shadow-xl transition overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <div className="mt-1 text-sm text-muted-foreground">Dydžiai: {p.sizes.join("/")}</div>
                <div className="mt-2 font-medium">{fmtEUR(p.priceEUR)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

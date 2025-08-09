"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/ui/cart-context"; // adjust path if needed

type P = {
  product: { sku: string; title: string; price: number; image: string; sizes: string[] };
};

export default function BuyClient({ product }: P) {
  const router = useRouter();
  const { addItem, hasItem } = useCart();

  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  const addToCart = () => {
    if (!size || adding) return;
    addItem({ sku: product.sku, title: product.title, price: product.price, size, image: product.image });
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
  };

  const buyNow = () => {
    if (!size || buying) return;

    // Do NOT add if already present; just go checkout
    const inCart = hasItem(product.sku, size);
    if (!inCart) {
      addItem({ sku: product.sku, title: product.title, price: product.price, size, image: product.image });
    }

    setBuying(true);
    setTimeout(() => router.push("/checkout"), 250);
  };

  return (
    <>
      <div className="mt-6">
        <div className="text-sm mb-2">Pasirink dydį</div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1 rounded-xl border text-sm transition ${
                size === s ? "bg-white text-black" : "hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={buyNow}
          disabled={buying}
          className={`px-4 py-2 rounded-xl transition-colors active:translate-y-[1px] ${
            buying ? "bg-blue-500 text-white" : "border"
          }`}
        >
          {buying ? "Vykdoma…" : "Pirkti dabar"}
        </button>

        <button
          onClick={addToCart}
          disabled={adding}
          className={`px-4 py-2 rounded-xl transition-colors active:translate-y-[1px] ${
            adding ? "bg-emerald-500 text-black" : "border"
          }`}
        >
          {adding ? "Įdėta!" : "Į krepšelį"}
        </button>
      </div>
    </>
  );
}

// components/ProductCard.tsx
/* LT komentarai:
 - Pirmam kortelės vaizdui taikome priority/eager/high fetchPriority (LCP)
 - Būtinai NUSTATOME `sizes`, kad Next sugeneruotų teisingus breakpoints ir nesiųstų per didelių img
 - aspect-[4/5] paliekam dėl dizaino; width/height padeda apskaičiuoti vietos rezervą
*/

import Image from "next/image";
import Link from "next/link";

type Product = {
  slug: string;
  title: string;
  price: number;
  image: string; // pvz. "/products/xxx.webp" (arba .png, jei dar nekeitei)
};

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const isFirst = index === 0; // LCP kandidatas
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border">
        <Image
          src={product.image}
          alt={product.title}
          fill
          // dydžių taisyklės: 4 stulp. ≥1024px, 3 stulp. ≥768px, kitaip 2 stulp.
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          // LCP fokusas pirmam paveikslėliui virš „fold’o“:
          priority={isFirst}
          loading={isFirst ? "eager" : "lazy"}
          fetchPriority={isFirst ? "high" : "auto"}
          // jei turėsi blurDataURL – pridėk:
          // placeholder="blur"
          // blurDataURL={product.blurDataURL}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{product.title}</h3>
        <span className="text-sm text-muted-foreground">{product.price} €</span>
      </div>
    </Link>
  );
}

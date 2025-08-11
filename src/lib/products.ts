// lib/products.ts
// LT: Produktų nuskaitymas iš /public/products + blur žemėlapis iš _images.json

import fs from "node:fs";
import path from "node:path";
import imagesMeta from "@/../public/products/_images.json"; 

type ImageMeta = { image: string; blurDataURL: string };
const blurMap = new Map<string, string>(
  (imagesMeta as ImageMeta[]).map((m) => [m.image, m.blurDataURL])
);

export type Size = "XS" | "S" | "M" | "L" | "XL";
export type Product = {
  sku: string;
  title: string;
  priceEUR: number;
  sizes: Size[];
  image: string;          // galutinis kelias, pageidautina .webp
  blurDataURL?: string;   // neprivalomas
};

const DEFAULT_PRICE = 29.99;
const DEFAULT_SIZES: Size[] = ["S", "M", "L"];

// LT: humanizuoja pavadinimą
function humanize(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

// LT: SKU iš failo vardo
function toSku(name: string) {
  return name.replace(/\.[^.]+$/, "").toUpperCase().replace(/[^A-Z0-9]+/g, "-");
}

// LT: dydžių dekodavimas, pvz. "SML" -> ["S","M","L"]
function parseSizes(s: string): Size[] {
  const map: Record<string, Size> = { x: "XS", s: "S", m: "M", l: "L", xl: "XL" };
  return s
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace("xxl", "xl")
    .split("")
    .map((ch) => map[ch])
    .filter(Boolean) as Size[];
}

/**
 * LT: Palaiko abu formatus:
 * 1) SKU--Pavadinimas--29.99--SML.ext
 * 2) dress-black.ext   (fallback: SKU iš name, human title, default price/sizes)
 *
 * Grąžina bazinius laukus + pasirinktą image kelią (.webp jei yra) ir blurDataURL jei yra.
 */
function parseFileName(file: string, dirAbs: string): Product | null {
  const base = path.basename(file);
  const ext = path.extname(base);                // pvz. ".png"
  const nameNoExt = base.slice(0, -ext.length);  // pvz. "SKU--Pavadinimas--29.99--SML"

  // Preferuojam .webp kaip galutinį šaltinį
  const webpFileAbs = path.join(dirAbs, `${nameNoExt}.webp`);
  const webpExists = fs.existsSync(webpFileAbs);
  const imagePath = webpExists ? `/products/${nameNoExt}.webp` : `/products/${base}`;
  const blurDataURL = blurMap.get(imagePath);

  // Rich pattern
  const m = base.match(/^(.*?)--(.*?)--(\d+(?:[.,]\d+)?)--([a-zA-Z]+)\.(png|jpg|jpeg|webp)$/i);
  if (m) {
    const [, sku, rawTitle, rawPrice, rawSizes] = m;
    const title = humanize(rawTitle);
    const priceEUR = parseFloat(rawPrice.replace(",", "."));
    const sizes = parseSizes(rawSizes);

    return { sku, title, priceEUR, sizes, image: imagePath, ...(blurDataURL ? { blurDataURL } : {}) };
  }

  // Simple pattern
  const simple = base.match(/^(.+)\.(png|jpg|jpeg|webp)$/i);
  if (simple) {
    const nameOnly = simple[1];
    return {
      sku: toSku(base),
      title: humanize(nameOnly),
      priceEUR: DEFAULT_PRICE,
      sizes: DEFAULT_SIZES,
      image: imagePath,
      ...(blurDataURL ? { blurDataURL } : {}),
    };
  }

  return null;
}

export async function getProducts(): Promise<Product[]> {
  const dirAbs = path.join(process.cwd(), "public", "products");
  if (!fs.existsSync(dirAbs)) return [];

  // LT: pasiimam visus kandidatus (png/jpg/jpeg/webp), kad palaikytume abu scenarijus
  const files = fs
    .readdirSync(dirAbs)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    // jei yra ir .webp, ir .png su ta pačia baze, rodysim per .webp (parseFileName tai jau sutvarko)
    .sort();

  const items: Product[] = [];
  for (const f of files) {
    const p = parseFileName(f, dirAbs);
    if (p) items.push(p);
  }

  // LT: jei kataloge yra ir .png, ir .webp su ta pačia baze, aukščiau abu pateks.
  // Kad nedubliuotų, dedupinam pagal image (ar sku).
  const seen = new Set<string>();
  const deduped: Product[] = [];
  for (const it of items) {
    const key = it.sku; // arba it.image
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(it);
  }

  return deduped.sort((a, b) => a.sku.localeCompare(b.sku));
}

export async function getAllSkus() {
  const list = await getProducts();
  return list.map((p) => p.sku);
}

export async function getProductBySku(sku: string) {
  const list = await getProducts();
  return list.find((p) => p.sku === sku) ?? null;
}

import fs from "node:fs";
import path from "node:path";

export type Size = "XS" | "S" | "M" | "L" | "XL";
export type Product = {
  sku: string;
  title: string;
  priceEUR: number;
  sizes: Size[];
  image: string;
};

const DEFAULT_PRICE = 29.99;
const DEFAULT_SIZES: Size[] = ["S", "M", "L"];

function humanize(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, m => m.toUpperCase());
}
function toSku(name: string) {
  return name.replace(/\.[^.]+$/, "").toUpperCase().replace(/[^A-Z0-9]+/g, "-");
}
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
 * Supports both:
 * 1) SKU--Pavadinimas--29.99--SML.jpg
 * 2) dress-black.png   (fallback: SKU from name, human title, default price/sizes)
 */
function parseFileName(file: string): Omit<Product, "image"> | null {
  const base = path.basename(file);

  // rich pattern
  const m = base.match(/^(.*?)--(.*?)--(\d+(?:[.,]\d+)?)--([a-zA-Z]+)\.(png|jpg|jpeg|webp)$/);
  if (m) {
    const [, sku, rawTitle, rawPrice, rawSizes] = m;
    return {
      sku,
      title: humanize(rawTitle),
      priceEUR: parseFloat(rawPrice.replace(",", ".")),
      sizes: parseSizes(rawSizes),
    };
  }

  // simple pattern (filename only)
  const simple = base.match(/^(.+)\.(png|jpg|jpeg|webp)$/i);
  if (simple) {
    const name = simple[1];
    return {
      sku: toSku(base),
      title: humanize(name),
      priceEUR: DEFAULT_PRICE,
      sizes: DEFAULT_SIZES,
    };
  }

  return null;
}

export async function getProducts(): Promise<Product[]> {
  const dir = path.join(process.cwd(), "public", "products");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  const items: Product[] = [];
  for (const f of files) {
    const parsed = parseFileName(f);
    if (!parsed) continue;
    items.push({ ...parsed, image: "/products/" + f });
  }
  return items.sort((a, b) => a.sku.localeCompare(b.sku));
}

export async function getAllSkus() {
  const list = await getProducts();
  return list.map((p) => p.sku);
}

export async function getProductBySku(sku: string) {
  const list = await getProducts();
  return list.find((p) => p.sku === sku) ?? null;
}

import fs from "node:fs";
import path from "node:path";

export type Size = "XS" | "S" | "M" | "L" | "XL";
export type Product = {
    sku: string;
    title: string;
    priceEUR: number;
    sizes: Size[];
    image: string; // "/products/…"
};

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

function parseFileName(file: string) {
    const base = path.basename(file);
    const m = base.match(/^(.*?)--(.*?)--(\d+(?:[.,]\d+)?)--([a-zA-Z]+)\.(png|jpg|jpeg|webp)$/);
    if (!m) return null;
    const [, sku, rawTitle, rawPrice, rawSizes] = m;
    const title = rawTitle.replace(/-/g, " ").trim();
    const priceEUR = parseFloat(rawPrice.replace(",", "."));
    const sizes = parseSizes(rawSizes);
    return { sku, title, priceEUR, sizes } as Omit<Product, "image">;
}

export async function getProducts(): Promise<Product[]> {
    const dir = path.join(process.cwd(), "public", "products");
    if (!fs.existsSync(dir)) return [];
    const files = fs
        .readdirSync(dir)
        .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
    const items: Product[] = [];
    for (const f of files) {
        const parsed = parseFileName(f);
        if (!parsed) continue;
        items.push({ ...parsed, image: "/products/" + f });
    }
    return items.sort((a, b) => a.sku.localeCompare(b.sku));
}

export async function getProductBySku(sku: string) {
    const list = await getProducts();
    return list.find((p) => p.sku === sku) ?? null;
}

export async function getAllSkus() {
    const list = await getProducts();
    return list.map((p) => p.sku);
}

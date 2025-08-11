// LT: Vaizdų paruošimas e-shopui
// - Konvertuoja PNG/JPG/JPEG -> WebP (max 1600px plotis, Q=82)
// - Palieka esamus .webp nepakeistus (nebent nori perrašyti – žr. flag'ą overwriteWebp)
// - Generuoja blurDataURL (24px webp) ir sukuria public/products/_images.json

import sharp from "sharp";
import { globby } from "globby";
import { basename, dirname, join, relative, extname } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const PUBLIC_DIR = join(root, "public");
const PRODUCTS_DIR = join(PUBLIC_DIR, "products");
const OUTPUT_JSON = join(PRODUCTS_DIR, "_images.json");

// Konfigai
const maxWidth = 1600;         // max plotį galima pasireguliuoti
const webpQuality = 82;        // 80–85 – dažnas sweet spot
const blurWidth = 24;          // blur miniatiūros plotis
const blurQuality = 30;        // blur kokybė (gali būti mažesnė)
const overwriteWebp = false;   // true -> perrašys ir jau esamus .webp

// Pagalbinė: gražiau išvesti kelią
const rel = (p) => "/" + relative(PUBLIC_DIR, p).replaceAll("\\", "/");

const files = await globby([
  "public/products/**/*.{png,jpg,jpeg,webp}",
], { sort: true });

if (!files.length) {
  console.log("Nerasta failų: public/products/**/*.{png,jpg,jpeg,webp}");
  process.exit(0);
}

const result = [];
let converted = 0;
let reused = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  const dir = dirname(file);
  const nameNoExt = basename(file, ext);
  const outWebpPath = join(dir, `${nameNoExt}.webp`);

  // 1) Paruošiam WEBP (jei reikia)
  if (ext === ".webp") {
    if (!overwriteWebp) {
      reused++;
    } else {
      await sharp(file)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: webpQuality })
        .toFile(outWebpPath);
      converted++;
    }
  } else {
    await sharp(file)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: webpQuality })
      .toFile(outWebpPath);
    converted++;
  }

  // 2) BlurDataURL (visada pagal galutinį .webp)
  const blurBuf = await sharp(outWebpPath)
    .resize({ width: blurWidth, withoutEnlargement: true })
    .webp({ quality: blurQuality })
    .toBuffer();

  const blurDataURL = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  result.push({
    image: rel(outWebpPath),   // pvz. "/products/ABC-Pavadinimas-29.99-SML.webp"
    blurDataURL,
  });
}

// 3) Išsaugom JSON
await mkdir(dirname(OUTPUT_JSON), { recursive: true });
await writeFile(OUTPUT_JSON, JSON.stringify(result, null, 2), "utf8");

console.log("✔ Paruošta:", result.length, "vaizdų");
console.log("→ Konvertuota į WebP:", converted);
console.log("→ Palikta esamų WebP:", reused);
console.log("JSON:", rel(OUTPUT_JSON));

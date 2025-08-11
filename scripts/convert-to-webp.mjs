import sharp from "sharp";
import { globby } from "globby";
import { basename, dirname, join } from "node:path";
import { mkdir } from "node:fs/promises";

const files = await globby("public/products/**/*.png");
for (const file of files) {
  const dir = dirname(file);
  const name = basename(file, ".png");
  const out = join(dir, `${name}.webp`);
  await mkdir(dir, { recursive: true });
  await sharp(file)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);
  console.log("→", out);
}

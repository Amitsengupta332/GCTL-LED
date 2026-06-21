import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = path.resolve("public/images/blog");
const thumbsDir = path.resolve("public/images/blog/thumbs");
const heroDir = path.resolve("public/images/blog/hero");

await fs.mkdir(thumbsDir, { recursive: true });
await fs.mkdir(heroDir, { recursive: true });

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

const files = await fs.readdir(inputDir);

for (const file of files) {
  if (!/\.(avif|webp|jpg|jpeg|png)$/i.test(file)) continue;

  const inputPath = path.join(inputDir, file);
  const name = path.parse(file).name;

  const thumbPath = path.join(thumbsDir, `${name}.avif`);
  const heroPath = path.join(heroDir, `${name}.avif`);

  const oldSize = (await fs.stat(inputPath)).size;

  await sharp(inputPath)
    .resize({
      width: 720,
      height: 450,
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .avif({
      quality: 45,
      effort: 6,
    })
    .toFile(thumbPath);

  await sharp(inputPath)
    .resize({
      width: 1600,
      height: 600,
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .avif({
      quality: 48,
      effort: 6,
    })
    .toFile(heroPath);

  const thumbSize = (await fs.stat(thumbPath)).size;
  const heroSize = (await fs.stat(heroPath)).size;

  console.log(`${file}: original ${kb(oldSize)} | thumb ${kb(thumbSize)} | hero ${kb(heroSize)}`);
}

console.log("Blog images optimized successfully.");
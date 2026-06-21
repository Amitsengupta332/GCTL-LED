import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = path.resolve("public/images/categories");
const backupDir = path.resolve("public/images/categories-original-backup");

const targetWidth = 640;
const targetHeight = 480;
const quality = 48;

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

try {
  await fs.access(backupDir);
  console.log("Backup already exists. Skipping backup.");
} catch {
  await fs.cp(inputDir, backupDir, { recursive: true });
  console.log("Backup created:", backupDir);
}

const files = await fs.readdir(inputDir);

for (const file of files) {
  if (!/\.(avif|webp|jpg|jpeg|png)$/i.test(file)) continue;

  const inputPath = path.join(inputDir, file);
  const parsed = path.parse(file);

  // same filename রাখছি, কারণ তোমার HTML already .avif use করছে
  const tempPath = path.join(inputDir, `${parsed.name}.tmp.avif`);
  const finalPath = path.join(inputDir, `${parsed.name}.avif`);

  const oldSize = (await fs.stat(inputPath)).size;

  await sharp(inputPath)
    .resize({
      width: targetWidth,
      height: targetHeight,
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .avif({
      quality,
      effort: 6,
    })
    .toFile(tempPath);

  const newSize = (await fs.stat(tempPath)).size;

  await fs.rename(tempPath, finalPath);

  console.log(`${file}: ${kb(oldSize)} -> ${kb(newSize)}`);
}

console.log("Category images optimized successfully.");
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = path.resolve("public/images/hero_images_mobile_avif");
const backupDir = path.resolve("image-backups/hero-mobile-original-backup");

await fs.mkdir("image-backups", { recursive: true });

try {
  await fs.access(backupDir);
  console.log("Hero mobile backup already exists. Skipping backup.");
} catch {
  await fs.cp(inputDir, backupDir, { recursive: true });
  console.log("Backup created:", backupDir);
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

const files = await fs.readdir(inputDir);

for (const file of files) {
  if (!/\.avif$/i.test(file)) continue;

  const inputPath = path.join(inputDir, file);
  const tempPath = path.join(inputDir, `${path.parse(file).name}.tmp.avif`);
  const finalPath = path.join(inputDir, file);

  const oldSize = (await fs.stat(inputPath)).size;

  await sharp(inputPath)
    .resize({
      width: 640,
      height: 800,
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .avif({
      quality: 48,
      effort: 6,
    })
    .toFile(tempPath);

  const newSize = (await fs.stat(tempPath)).size;

  await fs.rename(tempPath, finalPath);

  console.log(`${file}: ${kb(oldSize)} -> ${kb(newSize)}`);
}

console.log("Hero mobile images optimized successfully.");
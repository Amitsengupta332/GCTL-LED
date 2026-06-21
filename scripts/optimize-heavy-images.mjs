import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const jobs = [
  {
    inputDir: "public/images/blog",
    backupDir: "public/images/blog-original-backup",
    width: 1200,
    height: 675,
    quality: 42,
  },
  {
    inputDir: "public/images/projects",
    backupDir: "public/images/projects-original-backup",
    width: 900,
    height: 600,
    quality: 44,
  },
];

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

for (const job of jobs) {
  const inputDir = path.resolve(job.inputDir);
  const backupDir = path.resolve(job.backupDir);

  try {
    await fs.access(inputDir);
  } catch {
    console.log(`Folder not found: ${job.inputDir}`);
    continue;
  }

  try {
    await fs.access(backupDir);
    console.log(`Backup already exists: ${job.backupDir}`);
  } catch {
    await fs.cp(inputDir, backupDir, { recursive: true });
    console.log(`Backup created: ${job.backupDir}`);
  }

  const files = await fs.readdir(inputDir);

  for (const file of files) {
    // এখন শুধু AVIF compress করছি, কারণ Lighthouse এ AVIF গুলোই বড় দেখাচ্ছে
    if (!/\.avif$/i.test(file)) continue;

    const inputPath = path.join(inputDir, file);
    const parsed = path.parse(file);

    const tempPath = path.join(inputDir, `${parsed.name}.tmp.avif`);
    const finalPath = path.join(inputDir, `${parsed.name}.avif`);

    const oldSize = (await fs.stat(inputPath)).size;

    await sharp(inputPath)
      .resize({
        width: job.width,
        height: job.height,
        fit: "cover",
        position: "center",
        withoutEnlargement: true,
      })
      .avif({
        quality: job.quality,
        effort: 6,
      })
      .toFile(tempPath);

    const newSize = (await fs.stat(tempPath)).size;

    await fs.rename(tempPath, finalPath);

    console.log(`${job.inputDir}/${file}: ${kb(oldSize)} -> ${kb(newSize)}`);
  }
}

console.log("Heavy blog/project images optimized successfully.");
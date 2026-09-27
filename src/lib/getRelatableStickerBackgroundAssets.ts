import { readdir } from "node:fs/promises";
import path from "node:path";

const assetDirectory = "relatable-sticker-background-assets";
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export async function getRelatableStickerBackgroundAssets(): Promise<string[]> {
  const directory = path.join(process.cwd(), "public", assetDirectory);

  try {
    const files = await readdir(directory, { withFileTypes: true });
    return files
      .filter(
        (file) => file.isFile() && supportedExtensions.has(path.extname(file.name).toLowerCase())
      )
      .map((file) => `/${assetDirectory}/${encodeURIComponent(file.name)}`)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

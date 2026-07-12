type ProductWithFilename = {
  id?: string;
  filename?: string;
  image_source?: string;
  image_thumbnail?: string;
};

/** Normalize the filename used for deduplication (original name or URL basename). */
export function getProductFilename(product: ProductWithFilename): string {
  if (typeof product.filename === "string" && product.filename.trim()) {
    return product.filename.trim().toLowerCase();
  }

  const url = product.image_source || product.image_thumbnail || "";
  if (!url) return String(product.id ?? "");

  try {
    const pathname = new URL(url).pathname;
    const segment = decodeURIComponent(pathname.split("/").pop() || "");
    const basename = segment.split("?")[0];
    return (basename || url).toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/** Keep the first product for each unique filename. */
export function filterUniqueProductsByFilename<T extends ProductWithFilename>(
  products: T[]
): T[] {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = getProductFilename(product);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

"use server";

import { getProducts } from "@/firebase";
import { polishToEnglish } from "@/lib/polishToEnglish";

function sanitizeProduct(p: any) {
  return {
    id: String(p?.id ?? ""),
    title: typeof p?.title === "string" ? p.title : undefined,
    categories: Array.isArray(p?.categories)
      ? p.categories.filter((c: unknown): c is string => typeof c === "string")
      : undefined,
    image_thumbnail:
      typeof p?.image_thumbnail === "string" ? p.image_thumbnail : undefined,
    image_source:
      typeof p?.image_source === "string" ? p.image_source : undefined,
  };
}

type SanitizedProduct = ReturnType<typeof sanitizeProduct>;

export async function getShopProduct(): Promise<{ products: SanitizedProduct[] }>;
export async function getShopProduct(
  slug: string
): Promise<SanitizedProduct | null>;
export async function getShopProduct(slug?: string) {
  const { products } = await getProducts();

  if (!slug) {
    const sorted = (products ?? []).slice().sort((a: any, b: any) =>
      String(a?.title ?? "").localeCompare(String(b?.title ?? ""))
    );
    return { products: sorted.map(sanitizeProduct) };
  }

  const product = (products ?? []).find(
    (p: any) => slug === polishToEnglish(p?.title ?? "")
  );

  // Keep return type compatible with current callers:
  // - product detail pages expect the product object
  // - if not found, return null-ish value
  return product ? sanitizeProduct(product) : null;
}

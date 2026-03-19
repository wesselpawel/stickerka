"use server";

import { getProducts } from "@/firebase";
import { polishToEnglish } from "@/lib/polishToEnglish";

export async function getProductsByCategory(cat: string) {
  const { products } = await getProducts();

  const safeCat = cat ?? "";
  const filtered = (products ?? [])
    .filter((product: any) =>
      (product?.categories ?? []).some((category: string) =>
        polishToEnglish(category).includes(polishToEnglish(safeCat))
      )
    )
    .sort((a: any, b: any) =>
      String(a?.title ?? "").localeCompare(String(b?.title ?? ""))
    );

  // Client boundary safety: remove Firestore timestamps / non-plain fields.
  // This route is server-rendered and data is passed into Client Components.
  return filtered.map((p: any) => ({
    id: String(p?.id ?? ""),
    title: typeof p?.title === "string" ? p.title : undefined,
    categories: Array.isArray(p?.categories)
      ? p.categories.filter((c: unknown): c is string => typeof c === "string")
      : undefined,
    image_thumbnail:
      typeof p?.image_thumbnail === "string" ? p.image_thumbnail : undefined,
    image_source:
      typeof p?.image_source === "string" ? p.image_source : undefined,
  }));
}

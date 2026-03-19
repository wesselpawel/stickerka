"use server";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  );
}

export async function getProductsByCategory(cat: string) {
  const res = await fetch(
    `${siteOrigin()}/api/shop/byCategory?cat=${
      cat ? cat : ""
    }&secret=${process.env.API_SECRET_KEY}`,
    { next: { revalidate: 5 } }
  );

  if (!res) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  // API can return `{ error: ... }` instead of an array.
  // Normalize to an array so UI code (slice/map) never crashes during prerender.
  return Array.isArray(data) ? data : [];
}

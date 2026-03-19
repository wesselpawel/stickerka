"use server";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  );
}

export async function getShopProduct(slug?: string) {
  const res = await fetch(
    `${siteOrigin()}/api/shop?slug=${
      slug ? slug : ""
    }&secret=${process.env.API_SECRET_KEY}`,
    { next: { revalidate: 360 } }
  );
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

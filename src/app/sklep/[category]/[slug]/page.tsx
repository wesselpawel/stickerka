import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// We don't need the slug/product details route.
// Redirect to the category page to avoid build-time fetching issues.
export default function Page({ params }: { params: any }) {
  const category = params?.category;
  if (!category) return redirect("/sklep");
  return redirect(`/sklep/${category}`);
}

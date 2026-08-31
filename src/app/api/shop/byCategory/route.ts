import { getProducts } from "@/firebase";
import { polishToEnglish } from "@/lib/polishToEnglish";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const products = await getProducts();
  const secret = req.nextUrl.searchParams.get("secret");
  const cat = req.nextUrl.searchParams.get("cat");

  if (secret !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (cat) {
    return NextResponse.json(
      products?.products
        ?.filter((product: any) =>
          (product.categories || []).some((category: string) =>
            polishToEnglish(category).includes(polishToEnglish(cat))
          )
        )
        // Deterministic ordering to avoid unstable prerender output.
        .sort((a: any, b: any) =>
          String(a?.title ?? "").localeCompare(String(b?.title ?? ""))
        )
    );
  } else {
    return NextResponse.json({ error: "Not Found" });
  }
}

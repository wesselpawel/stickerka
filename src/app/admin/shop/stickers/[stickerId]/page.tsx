import { notFound } from "next/navigation";
import { getProducts } from "@/firebase";
import EditStickerForm from "./EditStickerForm";

export default async function Page({
  params,
}: {
  params: { stickerId: string };
}) {
  const res: any = await getProducts();
  const products: any[] = res?.products ?? [];
  const sticker = products.find((p) => p?.id === params.stickerId);

  if (!sticker) {
    notFound();
  }

  return <EditStickerForm sticker={sticker} />;
}


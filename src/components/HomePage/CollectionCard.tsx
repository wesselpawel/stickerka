"use client";

import { useDispatch } from "react-redux";
import Image from "next/image";
import { setCart } from "@/redux/slices/shopSlice";
import { useCartQuantityFlow } from "@/components/Cart/CartQuantityFlow";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { COLLECTION_STICKER_SIZE, getCollectionUnitPrice } from "@/lib/collectionPricing";

type CollectionItem = {
  id: string;
  title?: string;
  source?: "sticker" | "upload";
  image_thumbnail?: string;
  image_source?: string;
};

type Collection = {
  id: string;
  name: string;
  items: CollectionItem[];
};

export default function CollectionCard({ collection }: { collection: Collection }) {
  const dispatch = useDispatch();
  const { openQuantityPicker } = useCartQuantityFlow();
  const collectionPrice = getCollectionUnitPrice(collection.items.length);

  const openCollectionPicker = () => {
    openQuantityPicker({
      eyebrow: collection.name,
      title: "Ile zestawów dodać?",
      unitPrice: collectionPrice,
      previewItems: collection.items.map((item, index) => ({
        id: item.id || String(index),
        title: item.title,
        image: item.image_thumbnail || item.image_source,
      })),
      onConfirm: (quantity) => {
        const images = collection.items
          .map((item) => item.image_thumbnail || item.image_source)
          .filter((image): image is string => Boolean(image));
        dispatch(
          setCart({
            id: `collection-${collection.id}`,
            collectionId: collection.id,
            collectionName: collection.name,
            isCollectionBundle: true,
            collectionStickerCount: collection.items.length,
            collectionImages: images,
            title: `Kolekcja ${collection.name}`,
            categories: ["kolekcja"],
            image_source: images[0] || "",
            image_thumbnail: images[0] || "",
            paperType: "normal",
            size: COLLECTION_STICKER_SIZE,
            quantity,
          })
        );
      },
    });
  };

  return (
    <button
      type="button"
      onClick={openCollectionPicker}
      aria-label={`Kup całą kolekcję ${collection.name}`}
      className="group relative flex min-h-32 w-full overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chill-sage focus-visible:ring-offset-2"
    >
      <span className="grid h-40 w-full grid-cols-4 overflow-hidden bg-white/10">
        {collection.items.slice(0, 4).map((item) => {
          const image = item.image_thumbnail || item.image_source;
          return image ? (
            <Image
              key={item.id}
              src={image}
              alt=""
              width={240}
              height={160}
              unoptimized
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span key={item.id} className="bg-white/10" aria-hidden="true" />
          );
        })}
      </span>
      <span className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/85 to-transparent p-4 pt-8 text-white">
        <span className="block font-bold">{collection.name}</span>
        <span className="block text-sm font-light">
          cała kolekcja od {getPolishCurrency(collectionPrice)}
        </span>
      </span>
    </button>
  );
}

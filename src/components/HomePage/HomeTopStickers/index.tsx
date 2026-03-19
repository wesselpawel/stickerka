import Link from "next/link";
import HomeStickerGrid from "./components/HomeStickerGrid";
import logo from "../../../../public/stickerkalogo.png";
import Image from "next/image";

type Sticker = {
  id: string;
  title?: string;
  categories?: string[];
  image_thumbnail?: string;
  image_source?: string;
};

/** Strip Firestore Timestamps / class instances so props are safe for Client Components. */
function toStickerTileProps(p: Record<string, unknown>): Sticker {
  return {
    id: String(p.id ?? ""),
    title: typeof p.title === "string" ? p.title : undefined,
    categories: Array.isArray(p.categories)
      ? p.categories.filter((c): c is string => typeof c === "string")
      : undefined,
    image_thumbnail:
      typeof p.image_thumbnail === "string" ? p.image_thumbnail : undefined,
    image_source:
      typeof p.image_source === "string" ? p.image_source : undefined,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function HomeTopStickers({
  products,
}: {
  products: ReadonlyArray<Record<string, unknown>>;
}) {
  const plain = products.map((p) => toStickerTileProps(p));
  const items = shuffle(plain).slice(0, 20);

  return (
    <section className="border-b border-neutral-800 bg-black/40 text-neutral-100">
      <div className="mx-auto max-w-[1600px] px-3 py-8 md:px-8 md:py-10">
        <Image
          src={logo}
          alt="Stickerka"
          width={200}
          height={200}
          className="mx-auto mb-4 w-[200px]"
        />
        

        {items.length > 0 ? (
          <HomeStickerGrid items={items} />
        ) : (
          <p className="mt-8 text-sm text-neutral-600">
            Wkrótce pojawią się tu stickery.
          </p>
        )}

        
      </div>
    </section>
  );
}

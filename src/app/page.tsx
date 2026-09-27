import HomeTagFilters from "@/components/HomePage/HomeTagFilters";
import HomeStickerTypes from "@/components/HomePage/HomeStickerTypes";
import LotteryWheel from "@/components/HomePage/LotteryWheel";
import { listOfPrizes } from "@/components/listOfPrizes";
import { getCollections, getProducts } from "@/firebase";
import { Metadata } from "next";
import Image from "next/image";
import { FaHandScissors, FaShippingFast } from "react-icons/fa";
import HeroSlider from "@/components/HomePage/HeroSlider";
import SeoContent from "@/components/SeoContent";
import RelatableStickerCreatorButton from "@/components/RelatableStickerCreatorButton";
import { getRelatableStickerBackgroundAssets } from "@/lib/getRelatableStickerBackgroundAssets";
import CollectionCard from "@/components/HomePage/CollectionCard";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sklep z naklejkami",
  description:
    "Sklep z ręcznie wycinanymi naklejkami. Kolekcja naklejek na każdą okazję. Zamów naklejkę dla siebie.",
  authors: [
    { name: "Paweł Wessel", url: "https://wesselpawel.com" },
    { name: "Eliza Czerwińska", url: "https://blackbellart.com/" },
  ],
  publisher: "Stickerka.pl",
  keywords: [
    "naklejki ręcznie wycinane, naklejki na każdą okazję, naklejki na ścianę, naklejki dla dzieci, naklejki, naklejki bajkowe, naklejki złote, naklejki holograficzne, naklejki srebrne, drukowanie naklejek, naklejki z anime, naklejki na ścianę do kuchni, naklejki na ścianę nowoczesne, naklejki na ścianę dinozaury, naklejki na ścianę kwiaty, nalepki na ścianę",
  ],
};
export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const productData = await getProducts();
  const collections = await getCollections();
  const relatableBackgroundAssets = await getRelatableStickerBackgroundAssets();
  const homeStickers = productData?.products ?? [];
  const safeHomeStickers = homeStickers.map((value: unknown) => {
    const product = asRecord(value);
    return {
      id: String(product.id ?? ""),
      title: typeof product.title === "string" ? product.title : undefined,
      categories: Array.isArray(product.categories)
        ? product.categories.filter(
            (category: unknown): category is string => typeof category === "string"
          )
        : undefined,
      image_thumbnail:
        typeof product.image_thumbnail === "string" ? product.image_thumbnail : undefined,
      image_source: typeof product.image_source === "string" ? product.image_source : undefined,
    };
  });
  const safeCollections = collections
    .map((value: unknown) => asRecord(value))
    .filter((collection) => collection.published !== false)
    .map((collection) => ({
      id: String(collection.id ?? ""),
      name: typeof collection.name === "string" ? collection.name : "",
      description: typeof collection.description === "string" ? collection.description : undefined,
      items: Array.isArray(collection.items)
        ? collection.items.map((value: unknown) => {
            const item = asRecord(value);
            return {
              id: String(item.id ?? ""),
              title: typeof item.title === "string" ? item.title : undefined,
              source: item.source === "upload" ? ("upload" as const) : ("sticker" as const),
              image_thumbnail:
                typeof item.image_thumbnail === "string" ? item.image_thumbnail : undefined,
              image_source: typeof item.image_source === "string" ? item.image_source : undefined,
            };
          })
        : [],
    }))
    .filter((collection) => collection.name && collection.items.length > 0);

  return (
    <>
      <LotteryWheel listOfPrizes={listOfPrizes} />
      <div className="relative w-full bg-[var(--page-background)] text-[var(--page-foreground)]">
        <div className="">
          {/* hero customer modal */}
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 pt-8 lg:flex-row lg:items-stretch">
            <div className="min-w-0 flex-1">
              <HeroSlider />
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:shrink-0 gap-4 lg:w-[min(31%,24rem)]">
              <RelatableStickerCreatorButton backgroundAssets={relatableBackgroundAssets} />
            </div>
          </div>
        </div>
        {safeCollections.length > 0 && (
          <section className="mx-auto mt-12 mb-16">
            <div className="px-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {safeCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </section>
        )}
        <HomeStickerTypes />
        <div className="">
          <div className="relative w-full">
            <HomeTagFilters products={safeHomeStickers} />
          </div>

          <div className="mt-12 lg:mt-24 h-max relative">
            <div className="flex flex-col-reverse lg:flex-row h-full w-full relative">
              <div className="theme-surface min-h-full lg:w-[60vw] xl:w-[50vw]">
                <Image
                  src="/home-images/stickers.webp"
                  width={1024}
                  height={1024}
                  alt="Nasze naklejki"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="theme-surface theme-text mb-12 flex min-h-full flex-col py-6 lg:mb-0 lg:pl-4 xl:pl-12">
                <h2 className="mb-6 mt-6 font-display text-2xl font-semibold sm:text-3xl md:mt-0 lg:text-4xl xl:text-5xl">
                  Unikalny sklep z naklejkami
                </h2>
                <div className="flex flex-row">
                  <FaHandScissors className="h-10 w-10 font-bold" />
                  <div className="ml-3 flex flex-col mt-1">
                    <h3 className="font-bold text-lg sm:text-xl xl:text-2xl ">
                      Spersonalizuj swoją naklejkę
                    </h3>
                    <p className="theme-muted text-sm 2xl:text-lg">
                      Zamów naklejkę ze swoją marką lub logo
                    </p>
                  </div>
                </div>
                <div className="flex flex-row mt-3">
                  <FaShippingFast className="h-10 w-10 font-bold" />
                  <div className="ml-3 flex flex-col mt-1">
                    <h3 className="font-bold text-lg sm:text-xl xl:text-2xl ">
                      Dostawa w ciągu 24 godzin
                    </h3>
                    <p className="theme-muted text-sm 2xl:text-lg">
                      Wysyłka w ciągu 24 godzin, zarówno w Polsce, jak i w Europie. W przypadku
                      zamówień o wartości 100 zł lub więcej, dostawa jest darmowa.
                    </p>
                  </div>
                </div>
                <div className="flex flex-row mt-3">
                  {/* 3-line icon (instead of chart) */}
                  <span
                    className="flex h-10 w-10 flex-col items-center justify-center gap-1"
                    aria-hidden
                  >
                    <span className="block h-0.5 w-7 rounded-full bg-current" />
                    <span className="block h-0.5 w-7 rounded-full bg-current" />
                    <span className="block h-0.5 w-7 rounded-full bg-current" />
                  </span>
                  <div className="ml-3 flex flex-col mt-1">
                    <h3 className="font-bold text-lg sm:text-xl xl:text-2xl ">
                      Wciąż się rozwijamy
                    </h3>
                    <p className="theme-muted text-sm 2xl:text-lg">
                      Mimo dużej ilości zamówień, mamy czas na tworzenie nowych naklejek. Wciąż
                      rozwijamy i optymalizujemy nasz sklep.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SeoContent page="home" />
        </div>
      </div>
    </>
  );
}

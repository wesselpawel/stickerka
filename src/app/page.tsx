import HomeTagFilters from "@/components/HomePage/HomeTagFilters";
import HomeStickerTypes from "@/components/HomePage/HomeStickerTypes";
import LotteryWheel from "@/components/HomePage/LotteryWheel";
import { listOfPrizes } from "@/components/listOfPrizes";
import { getProducts } from "@/firebase";
import { Metadata } from "next";
import Image from "next/image";
import { FaHandScissors, FaShippingFast } from "react-icons/fa";
import HeroSlider from "@/components/HomePage/HeroSlider";
import SeoContent from "@/components/SeoContent";
export const metadata: Metadata = {
  title: "Stickerka.pl - Jedyny taki sklep z naklejkami",
  description:
    "Ręcznie wycinane naklejki. Kup jedną z naszych naklejek i twórz własne. Naklejki złote, srebrne, holo. Naklejki na każdą okazję. Sklep z największą kolekcja naklejek ozdobnych.",
  authors: [
    { name: "Paweł Wessel", url: "https://wesselpawel.com" },
    { name: "Eliza Czerwińska", url: "https://blackbellart.com/" },
  ],
  publisher: "Stickerka.pl",
  keywords: [
    "naklejki ręcznie wycinane, naklejki na każdą okazję, naklejki na ścianę, naklejki dla dzieci, naklejki, naklejki bajkowe, naklejki złote, naklejki holograficzne, naklejki srebrne, drukowanie naklejek, naklejki z anime, naklejki na ścianę do kuchni, naklejki na ścianę nowoczesne, naklejki na ścianę dinozaury, naklejki na ścianę kwiaty, nalepki na ścianę",
  ],
  icons: [
    {
      url: "/favicon.ico",
      sizes: "48x48",
      type: "image/x-icon",
    },
  ],
};
export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  
  const productData = await getProducts();
  const homeStickers = productData?.products ?? [];
  const safeHomeStickers = homeStickers.map((p: any) => ({
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

  return (
    <>
      <LotteryWheel listOfPrizes={listOfPrizes} />
    <div className="relative bg-black/90 w-full">
       <HomeStickerTypes />
      <div className="">
        <div className="relative w-full">
          <div className="p-6 lg:p-24 lg:py-8">
          <HeroSlider/>
          </div>
          <HomeTagFilters products={safeHomeStickers} />
        </div>
        
        <div className="mt-12 lg:mt-24 h-max relative">
          <div className="flex flex-col-reverse lg:flex-row h-full w-full relative">
            <div className="min-h-full bg-white md:bg-chill-cream lg:w-[60vw] xl:w-[50vw]">
              <Image
                src="/home-images/stickers.webp"
                width={1024}
                height={1024}
                alt="Nasze naklejki"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mb-12 flex min-h-full flex-col py-6 text-chill-ink lg:mb-0 lg:pl-4 xl:pl-12">
              <h2 className="mb-6 mt-6 font-display text-2xl font-semibold sm:text-3xl md:mt-0 lg:text-4xl xl:text-5xl">
                Unikalny sklep z naklejkami
              </h2>
              <div className="flex flex-row">
                <FaHandScissors className="h-10 w-10 font-bold" />
                <div className="ml-3 flex flex-col mt-1">
                  <h3 className="font-bold text-lg sm:text-xl xl:text-2xl ">
                      Spersonalizuj swoją naklejkę
                  </h3>
                  <p className="text-sm text-chill-muted 2xl:text-lg">
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
                  <p className="text-sm text-chill-muted 2xl:text-lg">
                    Wysyłka w ciągu 24 godzin, zarówno w Polsce, jak i w Europie. W przypadku zamówień o wartości 100 zł lub więcej, dostawa jest darmowa.
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
                  <p className="text-sm text-chill-muted 2xl:text-lg">
                    Mimo dużej ilości zamówień, mamy czas na tworzenie nowych
                    naklejek. Wciąż rozwijamy i optymalizujemy nasz sklep.
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

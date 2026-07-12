import HomeTagFilters from "@/components/HomePage/HomeTagFilters";
import HomeStickerTypes from "@/components/HomePage/HomeStickerTypes";
import LotteryWheel from "@/components/HomePage/LotteryWheel";
import { listOfPrizes } from "@/components/listOfPrizes";
import { getProducts, incrementGoogleCounter } from "@/firebase";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaHandScissors, FaShippingFast } from "react-icons/fa";
export const metadata: Metadata = {
  title: "Stickerka.pl - Jedyny taki sklep z naklejkami",
  description:
    "Ręcznie wycinane naklejki. Kup jedną z naszych naklejek i twórz własne. Naklejki złote, srebrne, holo. Naklejki na każdą okazję. Sklep z największą kolekcja naklejek ozdobnych.",
  authors: [
    { name: "wesiu.dev", url: "https://wesiu.dev" },
    { name: "blackbell", url: "https://blackbellart.com/" },
  ],
  publisher: "wesiu.dev",
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
  const google = searchParams?.destination;
  if (google) {
    await incrementGoogleCounter();
  }
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
    <div className="relative bg-black/80 px-4 lg:px-6 pt-[20vh]">
      <LotteryWheel listOfPrizes={listOfPrizes} />
      
       <h2 className="text-center mx-auto text-xl font-bold mt-6">
       OD 100ZŁ WYSYŁKA ZA DARMO!
       </h2>
       <HomeStickerTypes />
      <div className="">
      
        <div className="relative mt-[7.5rem] w-full md:mt-[8.5rem] lg:mt-6">
          <HomeTagFilters products={safeHomeStickers} />
        </div>
        
        <div className="mt-12 lg:mt-24 h-max relative">
          <div className="flex flex-col-reverse lg:flex-row h-full w-full relative">
            <div className="min-h-full bg-white md:bg-chill-cream lg:w-[60vw] xl:w-[50vw]">
              <Image
                src="/home-images/stickers.webp"
                width={1024}
                height={1024}
                alt="Nasze naklejki wieloryb"
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
        <div className="mx-auto w-full py-8 text-chill-muted">
          <section aria-label="Naklejki na każdą okazję - opis">
            <h2 className="font-display text-lg font-semibold text-chill-ink sm:text-xl">
              A może stickerka?
            </h2>

            <p className="mt-3 text-sm leading-relaxed">
              <strong className="text-chill-ink">Stickerka.pl</strong> to miejsce z naklejkami na każdą okazję,
              <strong className="text-chill-ink"> personalizacji</strong> oraz
              wyjątkowym <strong className="text-chill-ink">designie</strong>.
              Nasz sklep z naklejkami to <strong className="text-chill-ink">szeroki wybór</strong>{" "}
              wzorów, dzięki którym możesz wyróżnić się, udekorować przestrzeń i nadać
              przedmiotom niepowtarzalny charakter.
            </p>

            <h3 className="mt-6 text-sm font-bold text-chill-ink">
              Dlaczego warto wybrać naklejki?
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              Naklejki to jeden z najprostszych i jednocześnie najbardziej efektownych sposobów
              na zmianę wyglądu. W kilka sekund możesz
              <strong className="text-chill-ink"> odświeżyć laptop</strong>,{" "}
              <strong className="text-chill-ink"> telefon</strong>,{" "}
              <strong className="text-chill-ink"> samochód</strong> oraz
              <strong className="text-chill-ink"> udekorować ściany</strong> w domu lub biurze.
            </p>

            <h3 className="mt-6 text-sm font-bold text-chill-ink">
              Naklejki na każdą okazję (laptop, telefon, ściany, samochód)
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li>
                <strong className="text-chill-ink">Naklejki dekoracyjne</strong> – dom, biuro, pokój dziecięcy.
              </li>
              <li>
                <strong className="text-chill-ink">Naklejki na laptopa i telefon</strong> – personalizacja i trwałość.
              </li>
              <li>
                <strong className="text-chill-ink">Naklejki na samochód</strong> – odporność na warunki i UV.
              </li>
              <li>
                <strong className="text-chill-ink">Naklejki okolicznościowe</strong> – urodziny, święta, eventy.
              </li>
              <li>
                <strong className="text-chill-ink">Naklejki personalizowane</strong> – logo, grafika, tekst.
              </li>
            </ul>

            <h3 className="mt-6 text-sm font-bold text-chill-ink">
              Wysoka jakość i trwałość
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              Nasze <strong className="text-chill-ink">naklejki</strong> są tworzone z materiałów wysokiej jakości:
              <strong className="text-chill-ink"> odporność na wodę i UV</strong>, intensywne kolory oraz prosta aplikacja.
              Możesz je łatwo przykleić i usunąć bez niechcianych śladów.
            </p>

            <h3 className="mt-6 text-sm font-bold text-chill-ink">
              Naklejki jako forma wyrażenia siebie
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              Naklejki to więcej niż dekoracja – to sposób na <strong className="text-chill-ink">osobowość</strong>, zainteresowania i styl.
              Wybieraj motywy <strong className="text-chill-ink">vintage</strong>, <strong className="text-chill-ink">humor</strong>, popkulturę lub minimalizm.
            </p>

            <h3 className="mt-6 text-sm font-bold text-chill-ink">
              Idealne dla firm i marek
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              W Stickerka.pl możesz zamówić <strong className="text-chill-ink">naklejki reklamowe</strong> i <strong className="text-chill-ink">branding</strong>:
              materiały promocyjne, oznaczenia produktów, elementy identyfikacji wizualnej oraz dodatki do zamówień.
            </p>

            <h3 className="mt-6 text-sm font-bold text-chill-ink">
              Łatwe zamawianie i szybka realizacja
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              Zakupy są proste: intuicyjny proces zamówienia, <strong className="text-chill-ink">szybka realizacja</strong> i wsparcie na każdym etapie.
              Sprawdź <Link href="/sklep" className="font-semibold text-chill-sage-dark hover:underline">sklep z naklejkami</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

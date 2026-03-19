import { Metadata } from "next";
import CheckoutSummary from "./CheckoutSummary";

export default function Page() {
  return (
    <div className="min-h-screen bg-chill-cream pb-16 pt-24 md:pt-28 lg:pt-32">
      <CheckoutSummary />
    </div>
  );
}

export const metadata: Metadata = {
  keywords: `naklejki, naklejki ręcznie wycinane, naklejki na każdą okazję, naklejki na ścianę, naklejki dla dzieci, naklejki, naklejki bajkowe, naklejki złote, naklejki holograficzne, naklejki srebrne, drukowanie naklejek, naklejki z anime, naklejki na ścianę do kuchni, naklejki na ścianę nowoczesne, naklejki na ścianę dinozaury, naklejki na ścianę kwiaty, nalepki na ścianę, wlepki, nalepki, wlepy, nakejki, nakleki, nalejki`,
  title: `Stickerka.pl: Sklep z Naklejkami - Koszyk`,
  description: `Kup jedną z naszych naklejek lub twórz własne. Naklejki złote, srebrne, holo. Naklejki na każdą okazję. Sklep z największą kolekcja naklejek ozdobnych.`,
  openGraph: {
    type: "website",
    url: "https://Stickerka.pl",
    title: `Stickerka.pl: Sklep z Naklejkami - Koszyk`,
    description: `Kup jedną z naszych naklejek lub twórz własne. Naklejki złote, srebrne, holo. Naklejki na każdą okazję. Sklep z największą kolekcja naklejek ozdobnych.`,
    siteName: "stickerka",
    images: [
      {
        url: "/zaklejkiLogo2.png",
      },
    ],
  },
};

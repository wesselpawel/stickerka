import Link from "next/link";
import HeroAbout from "../about/HeroAbout";
import { FaEnvelope, FaPhone, FaShoppingCart } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skontaktuj się z Stickerka.pl - Profesjonalna Obsługa Klienta",
  description:
    "Masz pytania, sugestie lub chcesz dowiedzieć się więcej? Skontaktuj się z naszym profesjonalnym zespołem obsługi klienta. Jesteśmy tutaj, aby sprostać Twoim oczekiwaniom i odpowiedzieć na wszelkie pytania dotyczące naszych produktów i usług. Znajdź nasze dane kontaktowe oraz godziny pracy. Czekamy na Twój telefon lub e-mail!",
  icons: [
    {
      url: "/favicon.ico",
      sizes: "48x48",
      type: "image/x-icon",
    },
  ],
};
export default function Page() {
  return (
    <>
      <HeroAbout
        mainH1={"SKONTAKTUJ SIĘ Z NAMI"}
        mainP={
          "Masz pytania, sugestie lub chcesz dowiedzieć się więcej? Nie wahaj się skontaktować z naszym profesjonalnym zespołem obsługi klienta. Jesteśmy dostępni, aby sprostać Twoim oczekiwaniom i odpowiedzieć na wszelkie pytania dotyczące naszych produktów i usług. "
        }
        firstH2="JESTEŚMY DLA CIEBIE"
        secondP="Czekamy, aby pomóc Ci w każdy możliwy sposób. Skontaktuj się bezpośrednio za pomocą podanych danych. Jesteśmy tutaj, aby uczynić Twoje doświadczenie z naszymi produktami jeszcze lepszym!"
        secondH2=""
        thirdP=""
        image={{
          src: "/about-images/closed-world.webp",
          alt: "Naklejka/Wlepa Piękny Świat W Słoiku",
        }}
        image2={{
          src: "/about-images/cornflakes-dragon.webp",
          alt: "Naklejka/Wlepa Smok Jedzący Płatki",
        }}
        image3={{
          src: "/about-images/flying-dragon.webp",
          alt: "Naklejka/Wlepa Lecący Smok",
        }}
        contactInfo={
          <div >
            
          </div>
        }
      />

      <Link
        href="/about"
        className="p-4 font-bold text-4xl flex flex-row items-center justify-center w-full bg-[#F7A4F2] rounded-3xl text-center mb-6 hover:bg-[#f7a4f2b4] duration-300 mt-12"
        title="Dowiedz się więcej"
      >
        Czytaj o naszej działalności
        <FaArrowRightLong className="ml-3 h-6 w-8" />
      </Link>
      <Link
        href="/sklep"
        className="p-4 font-bold text-4xl flex flex-row items-center justify-center w-full bg-[#F7A4F2] rounded-3xl text-center mb-12 hover:bg-[#f7a4f2b4] duration-300"
        title="Wszystkie nasze naklejki"
      >
        Zajrzyj do sklepu
        <FaShoppingCart className="ml-3 h-6 w-8" />
      </Link>
    </>
  );
}

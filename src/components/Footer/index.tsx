import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/stickerkalogo.png";
import { FaEnvelope, FaInstagram, FaPhone } from "react-icons/fa";
import { categoriesArray } from "@/components/categories";
import { polishToEnglish } from "@/lib/polishToEnglish";

const popularCategories = categoriesArray.slice(0, 6);

const helpLinks = [
  { label: "Kontakt", href: "/kontakt" },
];

export default function Footer() {
  return (
    <footer className="border-t border-chill-line/80 bg-chill-cream/90">
      <div className="mx-auto grid w-full grid-cols-1 gap-10 px-4 lg:px-6 py-12 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex max-w-[420px] flex-col gap-4 p-1">
          <p className="text-sm leading-relaxed text-chill-muted">
            Stickerka.pl to miejsce dla miłośników ręcznie wycinanych naklejek.
            Dbamy o jakość materiałów, dopracowane detale i szybkie realizacje.
            <span className="block mt-2">
              <Link
                title="O naszych naklejkach"
                href="/about/o-naszych-naklejkach"
                className="font-medium text-chill-sage-dark underline decoration-chill-mist underline-offset-2 hover:no-underline"
              >
                Poznaj naszą historię.
              </Link>
            </span>
          </p>

          <Link href="/" title="Strona główna" className="w-fit">
            <Image
              src={logo}
              width={220}
              height={220}
              alt="Stickerka.pl"
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-chill-ink">
              Stickerka.pl &copy; {new Date().getFullYear()}
            </h2>
            <p className="text-xs text-chill-muted">
              Zamówienia realizujemy w dni robocze. Darmowa dostawa od 100 zł.
            </p>
          </div>
        </div>

            <Link
              href="/about/tworzenie-wlasnych-naklejek"
              className="text-chill-sage-dark font-medium transition-colors hover:text-chill-sage/90"
            >
              Stwórz własną naklejkę
            </Link>

        <div className="flex flex-col p-1">
          <h2 className="font-display text-xl font-semibold text-chill-ink">
            Pomoc i informacje
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {helpLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-chill-muted transition-colors hover:text-chill-sage-dark"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col p-1">
          <h2 className="font-display text-xl font-semibold text-chill-ink">
            Kontakt
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="tel:+48 721 417 154"
              className="flex items-center text-chill-muted transition-colors hover:text-chill-sage-dark"
            >
              <FaPhone className="mr-3 text-xl text-chill-sage" />
              +48 721 417 154
            </Link>
            <p className="text-sm text-chill-muted">
              Godziny pracy:{" "}
              <span className="text-chill-ink font-medium">Pn–Pt</span>{" "}
              9:00–17:00
            </p>
            <Link
              href="https://www.instagram.com/Stickerka.pl/"
              className="flex items-center text-chill-muted transition-colors hover:text-chill-sage-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="mr-3 text-xl text-chill-sage" />
              Instagram: Stickerka.pl
            </Link>
            <Link
              href="/kontakt"
              className="mt-2 text-sm font-medium text-chill-sage-dark transition-colors hover:text-chill-sage/90"
            >
              Napisz do nas
            </Link>
          </div>
        </div>
      </div>

      
    </footer>
  );
}

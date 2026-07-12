import Link from "next/link";
import { FaBook, FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { RiEmojiStickerLine } from "react-icons/ri";

export default function About({ onClose }: { onClose: () => void }) {
  return (
    <div
      id="about-mega"
      role="navigation"
      aria-label="Sekcja O nas"
      className="fixed left-0 right-0 top-14 z-mega max-h-[min(70vh,520px)] w-full overflow-y-auto border-b border-chill-line bg-chill-cream/98 px-4 py-6 shadow-lg shadow-chill-ink/10 backdrop-blur-md md:top-[4.75rem] md:px-8 lg:px-12 xl:px-16 2xl:px-20"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <Link
          href="/about/"
          title="Dowiedz się więcej o nas"
          className="group flex overflow-hidden rounded-2xl border border-chill-line bg-white transition-shadow hover:shadow-md"
          onClick={() => onClose()}
        >
          <div className="flex w-full flex-row items-stretch">
            <div className="flex w-14 shrink-0 items-center justify-center bg-chill-mist/60 text-chill-sage-dark transition-colors group-hover:bg-chill-sage/25">
              <FaBook className="h-6 w-6" />
            </div>
            <div className="flex flex-col p-4">
              <h2 className="font-display text-lg font-semibold text-chill-ink">
                Czytaj o nas
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-chill-muted">
                Nasz utalentowany zespół twórców pracuje z pasją nad
                projektowaniem unikalnych naklejek.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/about/o-naszych-naklejkach"
          title="Czytaj o naszych naklejkach"
          className="group flex overflow-hidden rounded-2xl border border-chill-line bg-white transition-shadow hover:shadow-md"
          onClick={() => onClose()}
        >
          <div className="flex w-full flex-row items-stretch">
            <div className="flex w-14 shrink-0 items-center justify-center bg-chill-mist/60 text-chill-sage-dark transition-colors group-hover:bg-chill-sage/25">
              <RiEmojiStickerLine className="h-6 w-6" />
            </div>
            <div className="flex flex-col p-4">
              <h2 className="font-display text-lg font-semibold text-chill-ink">
                Nasze naklejki
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-chill-muted">
                Rozwijamy pasję do tworzenia naklejek od lat — od domowego
                warsztatu do cenionej marki.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/about/inspiracja-naklejkami"
          title="Zainspiruj się z nami"
          className="group flex overflow-hidden rounded-2xl border border-chill-line bg-white transition-shadow hover:shadow-md"
          onClick={() => onClose()}
        >
          <div className="flex w-full flex-row items-stretch">
            <div className="flex w-14 shrink-0 items-center justify-center bg-chill-mist/60 text-chill-sage-dark transition-colors group-hover:bg-chill-sage/25">
              <RiEmojiStickerLine className="h-6 w-6" />
            </div>
            <div className="flex flex-col p-4">
              <h2 className="font-display text-lg font-semibold text-chill-ink">
                Inspiracja naklejkami
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-chill-muted">
                Spersonalizowane naklejki, które oddają Twój styl.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/about/tworzenie-wlasnych-naklejek"
          title="Stwórz własną naklejkę"
          className="group flex overflow-hidden rounded-2xl border border-chill-line bg-white transition-shadow hover:shadow-md"
          onClick={() => onClose()}
        >
          <div className="flex w-full flex-row items-stretch">
            <div className="flex w-14 shrink-0 items-center justify-center bg-chill-mist/60 text-chill-sage-dark transition-colors group-hover:bg-chill-sage/25">
              <RiEmojiStickerLine className="h-6 w-6" />
            </div>
            <div className="flex flex-col p-4">
              <h2 className="font-display text-lg font-semibold text-chill-ink">
                Tworzenie własnych naklejek
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-chill-muted">
                Narzędzia i inspiracje do własnych projektów.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/about/projektanci-naklejek"
          title="Współpracuj z nami"
          className="group flex overflow-hidden rounded-2xl border border-chill-line bg-white transition-shadow hover:shadow-md"
          onClick={() => onClose()}
        >
          <div className="flex w-full flex-row items-stretch">
            <div className="flex w-14 shrink-0 items-center justify-center bg-chill-mist/60 text-chill-sage-dark transition-colors group-hover:bg-chill-sage/25">
              <FaUserGroup className="h-6 w-6" />
            </div>
            <div className="flex flex-col p-4">
              <h2 className="font-display text-lg font-semibold text-chill-ink">
                Współpraca
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-chill-muted">
                Dla artystów i projektantów z pasją do designu.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/kontakt"
          title="Skontaktuj się"
          className="group flex overflow-hidden rounded-2xl border border-chill-line bg-white transition-shadow hover:shadow-md"
          onClick={() => onClose()}
        >
          <div className="flex w-full flex-row items-stretch">
            <div className="flex w-14 shrink-0 items-center justify-center bg-chill-mist/60 text-chill-sage-dark transition-colors group-hover:bg-chill-sage/25">
              <FaUser className="h-6 w-6" />
            </div>
            <div className="flex flex-col p-4">
              <h2 className="font-display text-lg font-semibold text-chill-ink">
                Kontakt
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-chill-muted">
                Pytania i sugestie — jesteśmy tu dla Ciebie.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import ContactForm from "./ContactForm";
import { FaEnvelope, FaInstagram, FaPhone } from "react-icons/fa";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skontaktuj się z Stickerka.pl - Profesjonalna Obsługa Klienta",
  description:
    "Masz pytania, sugestie lub chcesz dowiedzieć się więcej? Skontaktuj się z naszym profesjonalnym zespołem obsługi klienta. Jesteśmy tutaj, aby sprostać Twoim oczekiwaniom i odpowiedzieć na wszelkie pytania dotyczące naszych produktów i usług. Znajdź nasze dane kontaktowe oraz godziny pracy. Czekamy na Twój telefon lub e-mail!",
};
export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7f1] text-[#24342f]">
      <section className="relative border-b border-[#dfe8de] bg-[#edf4eb]">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(#d5e5d8_1px,transparent_1px),linear-gradient(90deg,#d5e5d8_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#5e9d7d]">Stickerka.pl / kontakt</p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">Porozmawiajmy o czymś dobrym.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#5d6d66] sm:text-lg">Masz pytanie o naklejki, własny projekt albo zamówienie? Napisz. Czytamy każdą wiadomość i zwykle wracamy z odpowiedzią w ciągu jednego dnia roboczego.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <aside className="flex flex-col justify-between gap-8">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#5e9d7d]">Jesteśmy tutaj</p>
            <h2 className="max-w-sm font-display text-3xl font-semibold leading-tight sm:text-4xl">Mała wiadomość, duża sprawa.</h2>
            <p className="mt-4 max-w-sm leading-7 text-[#5d6d66]">Opowiedz nam, czego potrzebujesz. Pomożemy dobrać rozmiar, papier i najlepszy sposób realizacji.</p>
          </div>
          <div className="space-y-4 border-t border-[#d8e1d9] pt-6 text-sm">
            <a href="mailto:hello@stickerka.pl" className="flex items-center gap-3 font-semibold hover:text-[#5e9d7d]"><FaEnvelope className="text-[#5e9d7d]" /> hello@stickerka.pl</a>
            <a href="tel:+48721417154" className="flex items-center gap-3 font-semibold hover:text-[#5e9d7d]"><FaPhone className="text-[#5e9d7d]" /> +48 721 417 154</a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/Stickerka.pl" className="flex items-center gap-3 font-semibold hover:text-[#5e9d7d]"><FaInstagram className="text-[#5e9d7d]" /> Instagram</a>
          </div>
        </aside>

        <div className="rounded-[1.5rem] border border-[#d8e1d9] bg-white p-6 shadow-[0_20px_60px_rgba(36,52,47,0.08)] sm:p-9">
          <ContactForm />
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-3 px-5 pb-16 text-sm font-semibold text-[#5d6d66] sm:px-8">
        <Link href="/about" className="hover:text-[#5e9d7d]">Poznaj Stickerkę</Link>
        <Link href="/#gallery" className="hover:text-[#5e9d7d]">Zobacz naklejki</Link>
      </div>
    </main>
  );
}

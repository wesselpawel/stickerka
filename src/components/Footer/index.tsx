"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/stickerkalogo.png";
import { FaArrowRight, FaInstagram, FaPhone, FaRegClock,  FaShippingFast } from "react-icons/fa";
import { useState } from "react";
import dynamic from "next/dynamic";
import { FaScissors } from "react-icons/fa6";

const shopLinks = [
  { label: "Wszystkie naklejki", href: "/" },
];

const aboutLinks = [
  { label: "O Stickerka.pl", href: "/about" },
  { label: "Kontakt", href: "/contact" },
];

// Dynamic import for the upload popup (CreateStickerPopup)
const CreateStickerPopup = dynamic(() => import("../CreateStickerPopup"), {
  ssr: false,
});

export default function Footer() {
  // Control the visibility of the upload popup
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <footer className="border-t border-chill-line/80 bg-chill-cream">
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-12 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex max-w-[30rem] flex-col gap-5">
            <Link href="/" title="Stickerka.pl - strona główna" className="w-fit">
              <Image src={logo} width={220} height={220} alt="Stickerka.pl" className="h-11 w-auto" />
            </Link>
            <div>
              <h2 className="font-display text-2xl font-semibold text-chill-ink">Naklejki z charakterem</h2>
              <p className="mt-3 text-sm leading-relaxed text-chill-muted">
                Ręcznie przygotowywane naklejki, autorskie wzory i pomoc w realizacji własnych pomysłów.
                Tworzymy małe rzeczy, które dobrze pasują do Twojego stylu.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 border-b border-chill-sage-dark pb-1 text-sm font-semibold text-chill-sage-dark transition-colors hover:border-chill-ink hover:text-chill-ink"
              onClick={() => setUploadOpen(true)}
            >
              Stwórz własną naklejkę <FaArrowRight aria-hidden="true" />
            </button>
            {uploadOpen && <CreateStickerPopup open={uploadOpen} onOpenChange={setUploadOpen} />}
          </div>

          <FooterLinkGroup title="Sklep" links={shopLinks} />
          <FooterLinkGroup title="O nas" links={aboutLinks} />

          <div>
            <h2 className="font-display text-xl font-semibold text-chill-ink">Porozmawiajmy</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="tel:+48721417154" className="flex items-center text-chill-muted transition-colors hover:text-chill-sage-dark">
                <FaPhone className="mr-3 text-chill-sage" aria-hidden="true" />
                +48 721 417 154
              </Link>
              <p className="flex items-center text-chill-muted"><FaRegClock className="mr-3 text-chill-sage" aria-hidden="true" />Pn–Pt, 9:00–17:00</p>
              <Link href="https://www.instagram.com/Stickerka.pl/" className="flex items-center text-chill-muted transition-colors hover:text-chill-sage-dark" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="mr-3 text-chill-sage" aria-hidden="true" />Instagram: Stickerka.pl
              </Link>
              <Link href="/contact" className="mt-1 font-semibold text-chill-sage-dark transition-colors hover:text-chill-ink">Napisz do nas <FaArrowRight className="ml-1 inline" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-3 border-y border-chill-line py-5 text-sm text-chill-muted sm:grid-cols-3">
          <div className="flex items-center gap-3"><FaScissors className="text-chill-sage" aria-hidden="true" /><span><strong className="text-chill-ink">Ręczne wycinanie</strong><br />Dopracowane detale każdej naklejki</span></div>
          <div className="flex items-center gap-3"><FaShippingFast className="text-chill-sage" aria-hidden="true" /><span><strong className="text-chill-ink">Szybka realizacja</strong><br />Wysyłka w ciągu 24 godzin</span></div>
          <div className="flex items-center gap-3"><FaRegClock className="text-chill-sage" aria-hidden="true" /><span><strong className="text-chill-ink">Wsparcie przed zakupem</strong><br />Odpowiadamy w dni robocze</span></div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs text-chill-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Stickerka.pl &copy; {new Date().getFullYear()} · Darmowa dostawa od 100 zł</p>
          <p>Mała marka, dużo pomysłów.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="font-display text-xl font-semibold text-chill-ink">{title}</h2>
      <div className="mt-4 flex flex-col items-start gap-3 text-sm">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-chill-muted transition-colors hover:text-chill-sage-dark">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

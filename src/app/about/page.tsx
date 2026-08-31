"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import SeoContent from "@/components/SeoContent";
import CreateStickerPopup from "@/components/CreateStickerPopup";
import heroSilverSticker from "../../../public/home-images/silver.webp";

export default function Page() {
  const [createStickerOpen, setCreateStickerOpen] = useState(false);
  return (
    <main className="w-full bg-chill-cream px-4 pb-20 pt-20 text-chill-ink md:px-8 lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-chill-sage">Stickerka.pl</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Naklejki, które robią miejsce na Twój styl.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-chill-muted md:text-lg">
            Tworzymy i ręcznie wycinamy naklejki dla osób, które chcą dodać charakteru laptopowi,
            telefonowi, meblom albo własnej marce. Wybierz, czego dziś potrzebujesz.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center rounded-full bg-chill-sage px-5 py-3 font-bold text-chill-cream transition hover:bg-chill-sage-dark">
              Przejdź do sklepu <FaShoppingCart className="ml-2" />
            </Link>
            <button onClick={() => setCreateStickerOpen(true)} className="inline-flex items-center rounded-full border border-chill-line px-5 py-3 font-bold transition hover:border-chill-sage">
              Masz własny pomysł <FaArrowRightLong className="ml-2" />
            </button>
          </div>
        </div>
        <Image src={heroSilverSticker} width={1000} height={750} alt="Niebieska naklejka smoka" className="h-full max-h-[30rem] rounded-3xl object-cover" />
      </section>

      

      <section className="mx-auto mt-20 grid max-w-6xl gap-8 border-t border-chill-line pt-12 md:grid-cols-3">
        <div><h2 className="font-display text-2xl font-semibold">Od domowego warsztatu</h2><p className="mt-3 text-sm leading-relaxed text-chill-muted">Rozwijamy Stickerkę z pasji do ilustracji, pomysłowych wzorów i rzeczy, które można mieć zawsze przy sobie.</p></div>
        <div><h2 className="font-display text-2xl font-semibold">Ręczna praca</h2><p className="mt-3 text-sm leading-relaxed text-chill-muted">Dbamy o jakość materiałów i wykończenie każdej naklejki, ograniczając odpady podczas produkcji.</p></div>
        <div><h2 className="font-display text-2xl font-semibold">Szybki wybór</h2><p className="mt-3 text-sm leading-relaxed text-chill-muted">Gotowe wzory znajdziesz w sklepie. W sprawie większego lub niestandardowego zamówienia napisz do nas.</p></div>
      </section>
      <SeoContent page="about" />
      <CreateStickerPopup open={createStickerOpen} onOpenChange={setCreateStickerOpen} />
    </main>
  );
}

function InfoCard({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="group flex min-h-56 flex-col rounded-2xl border border-chill-line bg-chill-sand p-5 transition hover:-translate-y-1 hover:border-chill-sage hover:shadow-lg hover:shadow-black/20">
      <span className="text-3xl text-chill-sage">{icon}</span>
      <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-chill-muted">{text}</p>
      <span className="mt-auto pt-5 text-sm font-bold text-chill-sage group-hover:underline">Dowiedz się więcej <FaArrowRightLong className="ml-1 inline" /></span>
    </Link>
  );
}

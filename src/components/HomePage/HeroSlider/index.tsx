"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";

type HeroSlide = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  imageAlt: string;
  link?: { href: string; title: string };
  sizes?: string[];
};

const heroSlides: HeroSlide[] = [
  {
    id: 0,
    eyebrow: "Kolekcja Stickerka",
    title: "Znajdź wzór, który pasuje do Ciebie",
    description: "Ponad 2000 autorskich naklejek do kolekcjonowania od jednej sztuki.",
    imageAlt: "Kolekcja kolorowych naklejek Stickerka",
    link: { href: "/sklep", title: "Przejdź do sklepu" },
  },
  {
    id: 1,
    eyebrow: "Trzy rozmiary",
    title: "Mała, średnia czy duża?",
    description: "Wybierz format dopasowany do laptopa, telefonu, mebla albo ściany.",
    imageAlt: "Naklejka Stickerka w różnych rozmiarach",
    sizes: ["Mała · 6 cm", "Średnia · 8 cm", "Duża · 14 cm"],
  },
  {
    id: 2,
    eyebrow: "Twój pomysł",
    title: "Pobudź kreatywność",
    description: "Masz własny projekt? Opowiedz nam o nim, a wspólnie zamienimy go w naklejkę.",
    imageAlt: "Kreatywna ilustracja na naklejce",
    link: { href: "/kontakt", title: "Opowiedz o projekcie" },
  },
  {
    id: 3,
    eyebrow: "Wykończenia",
    title: "Dodaj blasku swojemu wzorowi",
    description: "Wybierz zwykły, złoty, srebrny albo holograficzny papier i pokaż swój styl.",
    imageAlt: "Holograficzna naklejka Stickerka",
    link: { href: "/about/o-naszych-naklejkach", title: "Poznaj materiały" },
  },
  {
    id: 4,
    eyebrow: "Bez minimum zamówienia",
    title: "Zacznij od jednej naklejki",
    description: "Każdy wzór wycinamy ręcznie, więc możesz testować, mieszać i kolekcjonować po swojemu.",
    imageAlt: "Ręcznie wycinana naklejka Stickerka",
    link: { href: "/sklep", title: "Zobacz wzory" },
  },
  {
    id: 5,
    eyebrow: "Pomysły na co dzień",
    title: "Udekoruj przedmioty",
    description: "Ożyw laptop, telefon, biurko, meble albo pokój jednym charakterystycznym detalem.",
    imageAlt: "Naklejka użyta do dekoracji przedmiotu",
    link: { href: "/about/inspiracja-naklejkami", title: "Zobacz inspiracje" },
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide((slideIndex + heroSlides.length) % heroSlides.length);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((slideIndex) => (slideIndex + 1) % heroSlides.length);
  }, []);

  const goToPreviousSlide = useCallback(() => {
    setCurrentSlide((slideIndex) => (slideIndex - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const intervalId = window.setInterval(goToNextSlide, 6000);
    return () => window.clearInterval(intervalId);
  }, [goToNextSlide, isPaused]);

  const activeSlide = heroSlides[currentSlide];

  return (
    <section
      aria-label="Najważniejsze informacje o Stickerka"
      className="relative aspect-[4/5] min-h-[34rem] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-chill-sand shadow-2xl shadow-black/30 sm:aspect-[16/11] sm:min-h-0 lg:aspect-[16/8]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <Image
        key={activeSlide.id}
        src={`/sliderImages/${activeSlide.id}.webp`}
        width={1600}
        height={900}
        priority={activeSlide.id === 0}
        alt={activeSlide.imageAlt}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1400px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
        <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
          {String(activeSlide.id + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white/20"
          aria-label={isPaused ? "Wznów prezentację" : "Zatrzymaj prezentację"}
        >
          {isPaused ? <FaPlay className="h-3 w-3" /> : <FaPause className="h-3 w-3" />}
        </button>
      </div>
      <div className="absolute inset-x-4 bottom-16 z-10 max-w-xl text-white sm:inset-x-8 sm:bottom-20 lg:inset-x-12 lg:bottom-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-chill-sage sm:text-sm">{activeSlide.eyebrow}</p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">{activeSlide.title}</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">{activeSlide.description}</p>
        {activeSlide.sizes && (
          <div className="mt-5 flex max-w-md divide-x divide-white/20 rounded-2xl border border-white/15 bg-black/25 backdrop-blur-sm">
            {activeSlide.sizes.map((size) => <span key={size} className="flex-1 px-3 py-3 text-center text-xs font-semibold text-white/90 sm:text-sm">{size}</span>)}
          </div>
        )}
        {activeSlide.link && (
          <Link href={activeSlide.link.href} className="mt-5 inline-flex items-center rounded-full bg-chill-sage px-5 py-3 text-sm font-bold text-chill-cream transition hover:bg-white hover:text-chill-cream sm:text-base">
            {activeSlide.link.title}<FaArrowRight className="ml-2 h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between sm:bottom-6 sm:left-8 sm:right-8 lg:left-12 lg:right-12">
        <div className="flex items-center gap-2" role="tablist" aria-label="Slajdy prezentacji">
          {heroSlides.map((slide) => (
          <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(slide.id)}
              className={`h-2 rounded-full transition-all ${currentSlide === slide.id ? "w-8 bg-chill-sage" : "w-2 bg-white/55 hover:bg-white"}`}
              role="tab"
              aria-selected={currentSlide === slide.id}
              aria-label={`Slajd ${slide.id + 1}: ${slide.title}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={goToPreviousSlide} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white/20" aria-label="Poprzedni slajd"><FaArrowLeft /></button>
          <button type="button" onClick={goToNextSlide} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white/20" aria-label="Następny slajd"><FaArrowRight /></button>
        </div>
      </div>
    </section>
  );
}

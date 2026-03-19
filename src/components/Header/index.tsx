"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/stickerkalogo.png";
import { IoChevronDownOutline } from "react-icons/io5";
import About from "./About";
import { useEffect, useRef, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import Cart from "../Cart";
import CreateStickerPopup from "../CreateStickerPopup";

export default function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isMenuShow, setMenuShow] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [createStickerOpen, setCreateStickerOpen] = useState(false);
  const aboutWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAboutOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aboutOpen]);

  useEffect(() => {
    if (!aboutOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = aboutWrapRef.current;
      const target = e.target as Node;
      if (el && !el.contains(target)) setAboutOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [aboutOpen]);

  return (
    <>
      <Cart
        isCartOpen={isCartOpen}
        setCartOpen={setCartOpen}
        setMenuShow={setMenuShow}
      />
      <CreateStickerPopup
        open={createStickerOpen}
        onOpenChange={setCreateStickerOpen}
      />
      <header className="fixed left-0 top-0 z-header w-full border-b border-chill-line/80 bg-chill-cream/90 backdrop-blur-md supports-[backdrop-filter]:bg-chill-cream/75">
        <div className="mx-auto flex max-w-[1600px] flex-row items-center justify-between px-4 h-14 md:px-8 md:h-auto md:py-4 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex flex-row items-center gap-6 lg:gap-10">
            <Link
              href="/"
              className="flex flex-row items-center transition-opacity hover:opacity-85"
              title="Stickerka — strona główna"
            >
              <Image
                title="Sprawdź nasze naklejki"
                src={logo}
                width={600}
                height={600}
                alt="Stickerka"
                className="h-9 w-auto md:h-11"
              />
            </Link>

            <nav className="hidden md:flex md:items-center" aria-label="Główne">
              <div className="relative" ref={aboutWrapRef}>
                <button
                  type="button"
                  className="group flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-chill-muted transition-colors hover:bg-chill-sand hover:text-chill-ink"
                  aria-expanded={aboutOpen}
                  aria-controls="about-mega"
                  aria-haspopup="true"
                  id="about-mega-trigger"
                  onClick={() => setAboutOpen((o) => !o)}
                >
                  O nas
                  <IoChevronDownOutline
                    className={`h-4 w-4 transition-transform duration-200 ${
                      aboutOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {aboutOpen && <About onClose={() => setAboutOpen(false)} />}
              </div>
            </nav>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setMenuShow(false);
                setCreateStickerOpen(true);
              }}
              className="hidden items-center rounded-full bg-chill-sage px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-chill-sage-dark hover:shadow-md md:inline-flex"
            >
              Stwórz naklejkę
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-chill-line bg-chill-sand/60 text-chill-ink shadow-sm transition-all hover:border-chill-mist hover:bg-chill-sand md:flex"
              aria-label="Koszyk"
            >
              <FaCartShopping className="text-lg" />
            </button>
          </div>

          {/* Mobile cart button (left of hamburger) */}
          <div className="flex flex-row items-center gap-2 md:hidden">

          <button
            type="button"
            onClick={() => {
              setCartOpen(true);
              setMenuShow(false);
            }}
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-chill-line/80 bg-chill-sand/40 text-chill-ink shadow-sm transition-all hover:border-chill-mist hover:bg-chill-sand md:hidden"
            aria-label="Koszyk"
            >
            <FaCartShopping className="text-lg" />
          </button>

          <button
            type="button"
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-chill-line/80 bg-chill-sand/40 text-chill-ink shadow-sm transition-all hover:border-chill-mist hover:bg-chill-sand/60 md:hidden"
            onClick={() => setMenuShow(!isMenuShow)}
            aria-expanded={isMenuShow}
            aria-label="Menu"
          >
            <span className="flex flex-col items-center justify-center gap-1" aria-hidden>
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
            </div>
        </div>
      </header>

      {/* Mobile menu: under header bar so the bar + hamburger stay usable */}
      <div
        className={`fixed left-0 top-14 z-[6000] w-full overflow-y-auto border-b border-chill-line/60 bg-chill-ink/70 backdrop-blur-md md:top-[4.75rem] md:h-[calc(100dvh-4.75rem)] md:hidden
          h-[calc(100dvh-3.5rem)]
          transform transition-all duration-300 ease-out
          ${isMenuShow ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-2 opacity-0 pointer-events-none"}`}
        aria-hidden={!isMenuShow}
        id="mobile-nav"
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-6 px-6 py-8">
          <Link
            href="/"
            onClick={() => setMenuShow(false)}
            className="text-xl font-medium text-chill-sand/95 hover:text-chill-cream transition-colors"
          >
            Strona główna
          </Link>
          <div className="flex flex-col gap-3 rounded-2xl border border-chill-line/60 bg-chill-ink/15 px-4 py-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-800">
              O nas
            </div>
            <Link
              href="/about/"
              onClick={() => setMenuShow(false)}
              className="rounded-xl bg-chill-ink/0 px-3 py-2 text-base font-medium text-chill-sand/95 hover:bg-chill-sage-dark/15 hover:text-chill-cream"
            >
              Czytaj o nas
            </Link>
            <Link
              href="/about/o-naszych-naklejkach"
              onClick={() => setMenuShow(false)}
              className="rounded-xl bg-chill-ink/0 px-3 py-2 text-base font-medium text-chill-sand/95 hover:bg-chill-sage-dark/15 hover:text-chill-cream"
            >
              Nasze naklejki
            </Link>
            <Link
              href="/about/inspiracja-naklejkami"
              onClick={() => setMenuShow(false)}
              className="rounded-xl bg-chill-ink/0 px-3 py-2 text-base font-medium text-chill-sand/95 hover:bg-chill-sage-dark/15 hover:text-chill-cream"
            >
              Inspiracja naklejkami
            </Link>
            <Link
              href="/about/tworzenie-wlasnych-naklejek"
              onClick={() => setMenuShow(false)}
              className="rounded-xl bg-chill-ink/0 px-3 py-2 text-base font-medium text-chill-sand/95 hover:bg-chill-sage-dark/15 hover:text-chill-cream"
            >
              Tworzenie własnych naklejek
            </Link>
            <Link
              href="/about/projektanci-naklejek"
              onClick={() => setMenuShow(false)}
              className="rounded-xl bg-chill-ink/0 px-3 py-2 text-base font-medium text-chill-sand/95 hover:bg-chill-sage-dark/15 hover:text-chill-cream"
            >
              Współpraca
            </Link>
            <Link
              href="/about/kontakt-z-zaklejkami"
              onClick={() => setMenuShow(false)}
              className="rounded-xl bg-chill-ink/0 px-3 py-2 text-base font-medium text-chill-sand/95 hover:bg-chill-sage-dark/15 hover:text-chill-cream"
            >
              Kontakt
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              setMenuShow(false);
              setCreateStickerOpen(true);
            }}
            className="w-full rounded-2xl bg-chill-sage px-6 py-3 text-base font-semibold text-white shadow-sm shadow-black/10 transition-colors hover:bg-chill-sage-dark"
          >
            Stwórz naklejkę
          </button>
          <button
            type="button"
            onClick={() => {
              setCartOpen(true);
              setMenuShow(false);
            }}
            className="flex h-14 w-full text-white items-center justify-center gap-2 rounded-2xl border border-chill-mist/50 transition-colors bg-indigo-600 hover:bg-[#f87ff0b6] duration-300"
            aria-label="Koszyk"
          >
            <FaCartShopping className="text-2xl" />
            <span className="font-semibold">Koszyk</span>
          </button>
        </div>
      </div>
    </>
  );
}

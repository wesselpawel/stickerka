"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/stickerkalogo.png";
import { useEffect, useRef, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import Cart from "../Cart";
import CreateStickerPopup from "../CreateStickerPopup";

const PROMO_MESSAGES = [
  "Ręcznie wycinane",
  "Przystępne ceny",
  "Stwórz swoją naklejkę",
] as const;

export default function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isMenuShow, setMenuShow] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [createStickerOpen, setCreateStickerOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const aboutWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setPromoIndex((i) => (i + 1) % PROMO_MESSAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const openCartFromGallery = () => {
      setCartOpen(true);
      setMenuShow(false);
    };
    window.addEventListener("sticker-cart-open", openCartFromGallery);
    return () => window.removeEventListener("sticker-cart-open", openCartFromGallery);
  }, []);

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

  useEffect(() => {
    if (!isMenuShow) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuShow(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuShow]);

  useEffect(() => {
    if (!isMenuShow) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      // Close if clicking outside the menu button area
      if (!target) setMenuShow(false);
    };
    // Only for desktop, use outside click detection via Escape
  }, [isMenuShow]);

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
      <header className="px-3 sticky left-0 top-0 z-header w-full border-b border-chill-line/80 bg-black backdrop-blur-md">
        <div className="mx-auto flex flex-row items-center justify-between  h-14 md:h-auto md:py-4">
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
                className="h-9 w-full md:h-11"
              />
            </Link>
          </div>
          <pre
            key={promoIndex}
            className="text-center text-wrap max-w-[150px] lg:max-w-full text-sm lg:text-lg font-bold text-green-600 animate-pulse"
          >
            {PROMO_MESSAGES[promoIndex]}
          </pre>
            

          {/* Desktop and mobile controls */}
          <div className="flex flex-row items-center gap-2">
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
            onClick={() => {
              setCartOpen(true);
              setMenuShow(false);
            }}
            className="relative z-10 flex h-11 w-11 items-center justify-center text-chill-ink shadow-sm transition-all"
            aria-label="Koszyk"
            >
            <FaCartShopping className="text-lg" />
          </button>

          <button
            type="button"
            className="relative z-10 flex h-11 w-11 items-center justify-center text-chill-ink shadow-sm transition-all"
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
        <div className="mx-auto flex w-3/4 flex-col gap-6 py-8">
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
              href="/contact"
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

      {/* Desktop menu: positioned dropdown from hamburger */}
      <div
        className={`hidden md:block fixed top-14 right-3 z-[6000] 
          transform transition-all duration-300 ease-out origin-top-right
          ${isMenuShow ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"}`}
        aria-hidden={!isMenuShow}
        id="desktop-nav"
      >
        <div className="mt-2 w-56 rounded-2xl border border-chill-line/60 bg-chill-ink/95 backdrop-blur-md shadow-xl shadow-black/40 overflow-hidden">
          <div className="flex flex-col">
            <Link
              href="/"
              onClick={() => setMenuShow(false)}
              className="px-6 py-4 text-base font-medium text-chill-sand/95 hover:bg-chill-sage/20 hover:text-chill-cream transition-colors border-b border-chill-line/40"
            >
              Strona główna
            </Link>
            <Link
              href="/about/"
              onClick={() => setMenuShow(false)}
              className="px-6 py-4 text-base font-medium text-chill-sand/95 hover:bg-chill-sage/20 hover:text-chill-cream transition-colors border-b border-chill-line/40"
            >
              Czytaj o nas
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuShow(false)}
              className="px-6 py-4 text-base font-medium text-chill-sand/95 hover:bg-chill-sage/20 hover:text-chill-cream transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
      
    </>
  );
}

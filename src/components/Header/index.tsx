"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/stickerkalogo.png";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FaCartShopping, FaMoon, FaSun } from "react-icons/fa6";
import Cart from "../Cart";
import CreateStickerPopup from "../CreateStickerPopup";

const PROMO_MESSAGES = ["Ręcznie wycinane", "Przystępne ceny", "Stwórz swoją naklejkę"] as const;

export default function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isMenuShow, setMenuShow] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [createStickerOpen, setCreateStickerOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const isDarkMode = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("stickerka-theme-change", onStoreChange);
      return () => window.removeEventListener("stickerka-theme-change", onStoreChange);
    },
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
  const aboutWrapRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const nextThemeIsDark = !isDarkMode;
    document.documentElement.classList.toggle("dark", nextThemeIsDark);
    localStorage.setItem("stickerka-theme", nextThemeIsDark ? "dark" : "light");
    window.dispatchEvent(new Event("stickerka-theme-change"));
  };

  useEffect(() => {
    const id = setInterval(() => {
      setPromoIndex((i) => (i + 1) % PROMO_MESSAGES.length);
    }, 5000);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("stickerka-theme")) return;
      document.documentElement.classList.toggle("dark", event.matches);
      window.dispatchEvent(new Event("stickerka-theme-change"));
    };
    mediaQuery.addEventListener("change", onSystemThemeChange);

    return () => {
      clearInterval(id);
      mediaQuery.removeEventListener("change", onSystemThemeChange);
    };
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
      <Cart isCartOpen={isCartOpen} setCartOpen={setCartOpen} setMenuShow={setMenuShow} />
      <CreateStickerPopup open={createStickerOpen} onOpenChange={setCreateStickerOpen} />
      <header className="theme-header px-3 sticky left-0 top-0 z-header w-full border-b backdrop-blur-md">
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
            className="text-center text-wrap max-w-[150px] lg:max-w-full text-sm lg:text-lg font-bold text-green-500"
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
              className="theme-header relative z-10 flex h-11 w-11 items-center justify-center shadow-sm transition-all"
              aria-label="Koszyk"
            >
              <FaCartShopping className="text-lg" />
            </button>

            <button
              type="button"
              className="theme-header relative z-10 flex h-11 w-11 items-center justify-center shadow-sm transition-all"
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
        className={`theme-menu fixed left-0 top-14 z-[6000] w-full overflow-y-auto border-b backdrop-blur-md md:top-[4.75rem] md:h-[calc(100dvh-4.75rem)] md:hidden
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
            className="theme-menu-link text-xl font-medium transition-colors"
          >
            Strona główna
          </Link>
          <div className="theme-menu-link flex flex-col gap-3 rounded-2xl border px-4 py-3">
            <div className="text-sm font-semibold uppercase tracking-wide">O nas</div>
            <Link
              href="/about/"
              onClick={() => setMenuShow(false)}
              className="theme-menu-link rounded-xl px-3 py-2 text-base font-medium"
            >
              Czytaj o nas
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuShow(false)}
              className="theme-menu-link rounded-xl px-3 py-2 text-base font-medium"
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
            onClick={toggleTheme}
            className="theme-toggle flex w-full items-center justify-between rounded-2xl px-6 py-3 text-base font-semibold"
            aria-label={isDarkMode ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
          >
            <span>{isDarkMode ? "Jasny motyw" : "Ciemny motyw"}</span>
            {isDarkMode ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
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
        <div className="theme-menu mt-2 w-56 rounded-2xl border backdrop-blur-md shadow-xl shadow-black/40 overflow-hidden">
          <div className="flex flex-col">
            <Link
              href="/"
              onClick={() => setMenuShow(false)}
              className="theme-menu-link px-6 py-4 text-base font-medium transition-colors border-b"
            >
              Strona główna
            </Link>
            <Link
              href="/about/"
              onClick={() => setMenuShow(false)}
              className="theme-menu-link px-6 py-4 text-base font-medium transition-colors border-b"
            >
              Czytaj o nas
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuShow(false)}
              className="theme-menu-link px-6 py-4 text-base font-medium transition-colors"
            >
              Kontakt
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle flex items-center justify-between border-t px-6 py-4 text-left text-base font-medium"
              aria-label={isDarkMode ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
            >
              <span>{isDarkMode ? "Jasny motyw" : "Ciemny motyw"}</span>
              {isDarkMode ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

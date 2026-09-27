"use client";

import { removeFromCart, setPromotion } from "@/redux/slices/shopSlice";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { polishToEnglish } from "@/lib/polishToEnglish";
import { removeNumbersFromString } from "@/lib/removeNumbersFromString";
import { cartItemTotalPln, lineTotalPln } from "@/lib/stickerPricing.js";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import CartLineImage from "./CartLineImage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Countdown } from "../Countdown";
import { toast } from "react-toastify";
import { getCouponByValue } from "@/firebase";
import { IoClose } from "react-icons/io5";

function paperLabel(type: string) {
  if (type === "silver") return "Srebrna";
  if (type === "gold") return "Złota";
  return "Zwykła";
}

/** Proste odmiany: 1 pozycja, 2–4 pozycje (z wyjątkiem 12–14), reszta pozycji */
function cartLinesLabel(n: number) {
  if (n === 1) return "1 pozycja";
  const m = n % 10;
  const m100 = n % 100;
  if (m >= 2 && m <= 4 && (m100 < 12 || m100 > 14)) return `${n} pozycje`;
  return `${n} pozycji`;
}

export default function Cart({
  isCartOpen,
  setCartOpen,
  setMenuShow,
}: {
  isCartOpen: boolean;
  setCartOpen: (isCartOpen: boolean) => void;
  setMenuShow: (isMenuShow: boolean) => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [promotionCode, setPromotionCode] = useState("");
  const [countdownTime, setCountdownTime] = useState(0);
  const [promotionCodeTries, setPromotionCodeTries] = useState(0);
  const [promotionCodeError, setPromotionCodeError] = useState("");
  const cart = useAppSelector((state: any) => state.shop.cart);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCartOpen, setCartOpen]);

  async function setupCart() {
    if (promotionCode === "") {
      setMenuShow(false);
      setCartOpen(false);
      router.push("/checkout");
      return;
    }
    if (promotionCode.length === 7 && promotionCode.includes("-")) {
      await getCouponByValue(promotionCode).then((res: any) => {
        if (res?.message?.error === false) {
          toast.success(res?.message?.value, {
            autoClose: 5000,
            closeOnClick: true,
          });
          dispatch(
            setPromotion({
              couponId: res?.coupon?.id,
              promotion: res?.coupon?.prizeId,
            })
          );
          localStorage.setItem("activeCoupon", res?.coupon?.id);
          setMenuShow(false);
          setCartOpen(false);
          router.push("/checkout");
        } else {
          toast.error(res?.message?.value, {
            closeOnClick: true,
            autoClose: 5000,
          });
          setPromotionCodeError(`Błąd: ${res?.message?.value}`);
          setPromotionCodeTries(promotionCodeTries + 1);
          if (promotionCodeTries < 2) {
            setCountdownTime(5);
            setTimeout(() => {
              setCountdownTime(0);
              setPromotionCodeError("");
            }, 5000);
          } else if (promotionCodeTries >= 2 && promotionCodeTries < 4) {
            setCountdownTime(30);
            setTimeout(() => {
              setCountdownTime(0);
              setPromotionCodeError("");
            }, 30000);
          } else if (promotionCodeTries >= 4) {
            setCountdownTime(60);
            setCountdownTime(0);
            setTimeout(() => {
              setPromotionCodeError("");
            }, 60000);
          }
          return;
        }
      });
    } else {
      toast.error("Błędny kod promocyjny.", {
        closeOnClick: true,
        autoClose: 5000,
      });
    }
  }

  return (
    <>
      {isCartOpen && (
        <div
          className="cart-overlay fixed inset-0 z-cart flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4 md:p-6"
          role="presentation"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="cart-dialog theme-surface theme-text flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col rounded-t-3xl border theme-border shadow-2xl shadow-black/15 sm:max-h-[85vh] sm:rounded-3xl md:max-w-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b theme-border px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
              <div>
                <h2
                  id="cart-dialog-title"
                  className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
                >
                  Twój koszyk
                </h2>
                {cart.length > 0 && (
                  <p className="theme-muted mt-1 text-sm">
                    {cartLinesLabel(cart.length)}
                    {" · "}
                    ceny zależne od rozmiaru
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="theme-surface-muted theme-text flex h-11 w-11 shrink-0 items-center justify-center rounded-full border theme-border transition-colors hover:bg-[var(--theme-hover)]"
                aria-label="Zamknij koszyk"
              >
                <IoClose className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable list */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
                  <div className="theme-surface-muted theme-text mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border theme-border">
                    <FaShoppingCart className="h-9 w-9" aria-hidden />
                  </div>
                  <p className="font-display text-lg font-medium">Koszyk jest pusty</p>
                </div>
              )}

              {cart.length > 0 && (
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {cart.map((item: any, i: number) => {
                    const cat = item.categories?.[0];
                    const href =
                      cat && item.title && !item.isCustomSticker ? "/#gallery" : "/#gallery";
                    return (
                      <li
                        key={
                          item.customStickerId
                            ? `custom-${item.customStickerId}`
                            : `${item.title}-${item.paperType}-${i}`
                        }
                      >
                        <article className="theme-surface-muted overflow-hidden rounded-2xl border theme-border shadow-sm">
                          <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                            <div className="theme-surface relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                              {item?.image_source || item?.image_thumbnail ? (
                                <CartLineImage
                                  item={item}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="theme-muted flex h-full items-center justify-center text-sm">
                                  —
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                <div className="min-w-0">
                                  {item.isCustomSticker ? (
                                    <>
                                      <span className="font-semibold leading-snug">
                                        {removeNumbersFromString(item.title)}
                                      </span>
                                      <span className="ml-2 inline-block rounded-full bg-chill-mist px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-chill-sage-dark">
                                        Własna grafika
                                      </span>
                                    </>
                                  ) : (
                                    <Link
                                      href={href}
                                      onClick={() => setCartOpen(false)}
                                      className="font-semibold leading-snug transition-colors hover:text-chill-sage-dark"
                                    >
                                      {removeNumbersFromString(item.title)}
                                    </Link>
                                  )}
                                  <p className="theme-muted mt-1 text-sm">
                                    {item.isCollectionBundle ? (
                                      <>
                                        <span className="font-medium theme-text">
                                          {item.quantity}× zestaw
                                        </span>
                                        <span className="text-chill-line"> · </span>
                                        {item.collectionStickerCount} wzorów
                                      </>
                                    ) : (
                                      <>
                                        <span className="font-medium theme-text">
                                          {item.quantity}×
                                        </span>{" "}
                                        {/* Naklejka Rozmiar  */}
                                        <span className="text-chill-line"> · </span>
                                        {item.isCustomSticker ? "grafika klienta" : "naklejka"}
                                        <span className="text-chill-line"> · </span>
                                        {polishToEnglish(item.size) === "sticker-l"
                                          ? "14cm szer."
                                          : polishToEnglish(item.size) === "sticker-m"
                                            ? "10cm szer."
                                            : "6cm szer."}
                                        {!item.isCustomSticker && (
                                          <>
                                            <span className="text-chill-line"> · </span>
                                            {getPolishCurrency(
                                              lineTotalPln(1, item.size || item.stickerSize)
                                            )}
                                            /szt.
                                          </>
                                        )}
                                      </>
                                    )}
                                  </p>
                                </div>
                                <p className="shrink-0 font-display text-base font-semibold tabular-nums sm:text-lg">
                                  {getPolishCurrency(cartItemTotalPln(item))}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  dispatch(removeFromCart(i));
                                  toast.success("Usunięto z koszyka", {
                                    autoClose: 3000,
                                    closeOnClick: true,
                                  });
                                }}
                                className="theme-muted mt-3 text-sm font-medium underline decoration-chill-line/80 underline-offset-4 transition-colors hover:text-chill-sage-dark"
                              >
                                Usuń
                              </button>
                            </div>
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer actions */}
            <div className="sm:rounded-b-3xl theme-surface-muted shrink-0 border-t theme-border px-5 py-5 sm:px-6">
              {cart.length === 0 ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600 sm:w-auto sm:min-w-[160px]"
                  >
                    Zamknij
                  </button>
                  <Link
                    href="/#gallery"
                    onClick={() => setCartOpen(false)}
                    className="flex w-full items-center justify-center rounded-2xl bg-chill-sage-dark px-5 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-chill-sage sm:w-auto sm:min-w-[160px]"
                  >
                    Przeglądaj galerię
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="cart-promo"
                      className="theme-muted mb-1.5 block text-xs font-semibold uppercase tracking-wide"
                    >
                      Kod promocyjny
                    </label>
                    <input
                      id="cart-promo"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      placeholder="np. 123-456"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value)}
                      className="theme-surface-muted theme-text w-full rounded-xl border theme-border px-4 py-3 text-base shadow-inner shadow-black/5 placeholder:text-zinc-500 focus:border-chill-sage focus:outline-none focus:ring-2 focus:ring-chill-sage/35 dark:placeholder:text-zinc-400"
                    />
                    {promotionCodeError !== "" && (
                      <p
                        className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-red-700"
                        role="alert"
                      >
                        {promotionCodeError}
                        <Countdown countdownTime={countdownTime} />
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={promotionCodeError.length > 0}
                    title="Przejdź do płatności"
                    onClick={() => setupCart()}
                    className="w-full rounded-2xl bg-chill-sage-dark py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-chill-sage disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Do płatności
                  </button>

                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="theme-muted w-full py-2 text-center text-sm font-medium transition-colors hover:text-[var(--page-foreground)]"
                  >
                    Kontynuuj zakupy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { polishToEnglish } from "@/lib/polishToEnglish";
import { removeNumbersFromString } from "@/lib/removeNumbersFromString";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import StripeButton from "./StripeButton";
import OrderForm from "@/components/Checkout/OrderForm";
import { getCouponById } from "@/firebase";
import { listOfPrizes } from "@/components/listOfPrizes";
import { setPromotion } from "@/redux/slices/shopSlice";
import { getFinalPrice } from "@/lib/getFinalPrice";

const SHIPPING_PLN = 10;

export default function CheckoutSummary() {
  const { couponId, promotion } = useAppSelector((state: any) => state.shop);
  const [isLoading, setLoading] = useState(true);
  const cart = useAppSelector((state: any) => state.shop.cart);
  const { beforeDiscount, finalPrice, message } = getFinalPrice(
    promotion,
    cart
  );
  const freeShipping = beforeDiscount >= 100;
  const totalWithShipping = freeShipping ? finalPrice : finalPrice + SHIPPING_PLN;

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    city: "",
    postalCode: "",
    street: "",
    houseNumber: "",
    phoneNumber: "",
    acceptedTerms: false,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    city: "",
    postalCode: "",
    street: "",
    houseNumber: "",
    phoneNumber: "",
    acceptedTerms: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  }

  const dispatch = useAppDispatch();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), cart?.length ? 350 : 500);
    return () => clearTimeout(t);
  }, [cart?.length]);

  useEffect(() => {
    const id = localStorage?.getItem("activeCoupon");
    if (!id) return;

    let cancelled = false;
    async function fetchCoupon() {
      const res = await getCouponById(id);
      if (cancelled || !res || (res as any).error) return;
      const r = res as { id?: string; prizeId?: unknown };
      if (r.id != null && r.prizeId != null) {
        dispatch(
          setPromotion({ couponId: r.id, promotion: r.prizeId as number })
        );
        localStorage.setItem("activeCoupon", r.id);
      }
    }
    fetchCoupon();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const prizeTitle =
    promotion !== -1
      ? listOfPrizes.find(
          (p) => p.id === Number(promotion) || p.id === promotion
        )?.title
      : null;

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-16">
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-chill-line bg-white shadow-sm">
          <Image
            width={48}
            height={48}
            className="h-12 w-12"
            src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/abfa05c49acf005b8b1e0ef8eb25a67a7057eb20/svg-css/blocks-shuffle-2.svg"
            alt="Ładowanie"
          />
        </div>
        <p className="mt-4 text-sm text-chill-muted">Przygotowujemy podsumowanie…</p>
      </div>
    );
  }

  if (!cart?.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 text-center">
        <div className="rounded-3xl border border-chill-line bg-white p-10 shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-3xl">
            🛒
          </div>
          <h1 className="font-display text-2xl font-semibold text-zinc-900">
            Koszyk jest pusty
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Dodaj naklejki w sklepie, a potem wróć tutaj, żeby dokończyć zamówienie.
          </p>
          <Link
            href="/sklep"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-chill-sage-dark px-8 text-sm font-semibold text-white transition-colors hover:bg-chill-sage"
          >
            Przejdź do sklepu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 lg:pb-12">
      <nav className="text-xs text-chill-muted">
        <Link href="/sklep" className="hover:text-chill-sage-dark">
          Sklep
        </Link>
        <span className="mx-2 text-chill-line">/</span>
        <span className="text-chill-ink">Kasa</span>
      </nav>

      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-chill-ink md:text-4xl">
        Kasa
      </h1>
      <p className="mt-1 max-w-xl text-sm text-chill-muted">
        Sprawdź zamówienie, uzupełnij dane wysyłki i przejdź do bezpiecznej płatności.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
        {/* Order recap */}
        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-3xl border border-chill-line bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Do zapłaty
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {promotion !== -1 && message === "Kod aktywny" && (
                <span className="text-2xl font-semibold text-zinc-400 line-through decoration-zinc-400 md:text-3xl">
                  {getPolishCurrency(beforeDiscount)}
                </span>
              )}
              <span className="font-display text-3xl font-semibold text-zinc-900 md:text-4xl">
                {getPolishCurrency(totalWithShipping)}
              </span>
            </div>

            {promotion !== -1 && prizeTitle && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 ${
                  message === "Kod aktywny"
                    ? "border-chill-sage/30 bg-chill-sage/10"
                    : "border-chill-peach/50 bg-chill-peach/15"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    message === "Kod aktywny"
                      ? "text-chill-sage-dark"
                      : "text-chill-muted"
                  }`}
                >
                  {message === "Kod aktywny" ? message : "Kod"}
                </p>
                <p className="mt-1 text-sm text-zinc-800">
                  <span className="font-medium">{prizeTitle}</span>
                  {message === "Kod aktywny" && (
                    <span className="ml-2 font-semibold text-chill-sage-dark">
                      −{getPolishCurrency(beforeDiscount - finalPrice)}
                    </span>
                  )}
                  {message !== "Kod aktywny" && (
                    <span className="mt-2 block text-sm font-normal text-zinc-600">
                      {message}
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="mt-8 space-y-0 divide-y divide-zinc-200">
              {cart.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4"
                >
                  <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 sm:h-[88px] sm:w-[88px]">
                    {item?.image_thumbnail || item?.image_source ? (
                      <Image
                        width={120}
                        height={120}
                        src={item?.image_thumbnail || item?.image_source}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-zinc-400">
                        —
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.isCustomSticker ? (
                      <p className="font-semibold text-zinc-900">
                        {removeNumbersFromString(item.title)}
                      </p>
                    ) : (
                      <Link
                        href={`/sklep/${item.categories?.[0] ?? "wszystkie"}/${polishToEnglish(item.title)}`}
                        className="font-semibold text-zinc-900 underline decoration-zinc-300 decoration-1 underline-offset-2 hover:text-chill-sage-dark"
                      >
                        {removeNumbersFromString(item.title)}
                      </Link>
                    )}
                    <p className="mt-1 text-sm text-zinc-600">
                      {item.quantity}×{" "}
                      {item.isCustomSticker
                        ? "własna grafika · 20 zł/szt."
                        : "20 zł/szt."}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums text-zinc-900">
                      {getPolishCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm">
              <div className="flex justify-between gap-4 text-zinc-600">
                <span>Wartość produktów</span>
                <span className="tabular-nums text-zinc-900">
                  {getPolishCurrency(finalPrice)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-zinc-600">
                <span>Wysyłka</span>
                <span className="tabular-nums font-medium text-zinc-900">
                  {freeShipping ? (
                    <span className="text-chill-sage-dark">Darmowa</span>
                  ) : (
                    getPolishCurrency(SHIPPING_PLN)
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3 font-semibold text-zinc-900">
                <span>Razem</span>
                <span className="tabular-nums">
                  {getPolishCurrency(totalWithShipping)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Form + pay */}
        <div className="lg:col-span-7">
          <section className="rounded-3xl border border-chill-line bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-display text-xl font-semibold text-zinc-900">
              Dane do zamówienia
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Użyjemy ich do wysyłki i kontaktu w razie pytań.
            </p>
            <div className="mt-8">
              <OrderForm
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                handleChange={handleChange}
                formErrors={formErrors}
              />
              <StripeButton
                customerInfo={customerInfo}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                acceptedTerms={customerInfo.acceptedTerms}
                price={totalWithShipping}
                cart={cart}
                couponId={couponId}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

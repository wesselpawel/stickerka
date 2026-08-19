"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/slices/shopSlice";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { getPrice } from "@/lib/getStickerPrice";
import { STICKER_UNIT_PRICE_PLN } from "@/lib/stickerPricing.js";
import { removeNumbersFromString } from "@/lib/removeNumbersFromString";
import StickerTile from "./StickerTile";
import Masonry from "react-masonry-css";

export type HomeSticker = {
  id: string;
  title?: string;
  categories?: string[];
  image_thumbnail?: string;
  image_source?: string;
};

export default function HomeStickerGrid({ items }: { items: HomeSticker[] }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [selected, setSelected] = useState<HomeSticker | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const openModal = useCallback((s: HomeSticker) => {
    setSelected(s);
    setQuantity(1);
    setJustAdded(false);
  }, []);

  const handleDialogClose = useCallback(() => {
    setSelected(null);
    setJustAdded(false);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (selected) {
      if (!d.open) d.showModal();
      queueMicrotask(() => closeBtnRef.current?.focus());
    } else if (d.open) {
      d.close();
    }
  }, [selected]);

  const lineTotal = selected ? getPrice(quantity).sumAfterDiscount : 0;

  const handleAddToCart = () => {
    if (!selected?.title) return;
    dispatch(
      setCart({
        ...selected,
        // Single price/product mode: keep merge behavior consistent.
        paperType: "normal",
        quantity,
        price: lineTotal,
      })
    );
    toast.success("Dodano do koszyka", { autoClose: 3000, closeOnClick: true });
    setJustAdded(true);
  };

  const goCheckout = () => {
    dialogRef.current?.close();
    router.push("/checkout");
  };

  const browseMore = () => {
    dialogRef.current?.close();
  };

  const img = selected?.image_thumbnail || selected?.image_source || "";

  const breakpointColumnsObj = {
    default: 5,
    1366: 4,
    1100: 3,
    800: 2,
    500: 2,
  };

  return (
    <>
      <div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((p, i) => (
            <div key={p.id} className="">
              <StickerTile
                sticker={p}
                onOpen={() => openModal(p)}
                index={i}
              />
            </div>
          ))}
        </Masonry>
      </div>

      <dialog
        ref={dialogRef}
        className="sticker-quick-buy font-sans text-neutral-100"
        onClose={handleDialogClose}
        aria-labelledby="sticker-popup-title"
      >
        {selected && (
          <div className="flex max-h-[min(92dvh,42rem)] flex-col overflow-y-auto">
            {/* Top (sticky) */}
            <div className="sticky top-0 z-10 bg-neutral-900/60 backdrop-blur px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <h2
                  id="sticker-popup-title"
                  className="pr-2 text-base font-semibold leading-snug sm:text-lg"
                >
                  {removeNumbersFromString(selected.title || "")}
                </h2>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="min-h-[44px] min-w-[84px] shrink-0 rounded-lg border border-neutral-700 bg-neutral-800/40 px-3 text-sm font-medium text-neutral-100 hover:bg-neutral-800/60"
                  aria-label="Zamknij"
                >
                  Zamknij
                </button>
              </div>

              <div className="relative mx-auto mt-4 aspect-square w-full max-w-[min(260px,60vw)] overflow-hidden rounded-md border border-neutral-700 bg-neutral-900/30">
                {img ? (
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 60vw, 260px"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-neutral-400">
                    —
                  </span>
                )}
              </div>

              <p className="mt-4 text-center">
                <span className="text-xl font-bold sm:text-2xl">
                  {STICKER_UNIT_PRICE_PLN} zł
                </span>
                <span className="text-sm font-normal text-neutral-600">
                  {" "}
                  / sztuka
                </span>
              </p>
            </div>



            {/* Bottom (sticky) */}
            <div className="sticky bottom-0 z-10 bg-neutral-900/60 backdrop-blur px-4 py-2.5 sm:px-6">
              {!justAdded && (
                <>
                  <label htmlFor="sticker-qty" className="sr-only">
                    Ilość
                  </label>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-neutral-800 bg-neutral-800/20 text-base font-bold text-neutral-100"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Zmniejsz ilość"
                    >
                      −
                    </button>

                    <input
                      id="sticker-qty"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v) && v >= 1) setQuantity(v);
                      }}
                      className="min-h-[36px] w-14 rounded-lg border border-neutral-700 bg-neutral-800/30 px-2 text-center text-base font-semibold text-neutral-100"
                      aria-label="Ilość sztuk"
                    />

                    <button
                      type="button"
                      className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-neutral-800 bg-neutral-800/20 text-base font-bold text-neutral-100"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Zwiększ ilość"
                    >
                      +
                    </button>
                  </div>

                  <p className="mt-1 text-center text-sm font-bold sm:text-base">
                    Razem: {getPolishCurrency(lineTotal)}
                  </p>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="mt-2 min-h-[44px] w-full rounded-lg bg-indigo-600 hover:bg-[#f87ff0b6] duration-300 py-2.5 text-center text-base font-semibold text-white hover:bg-neutral-800"
                  >
                    Dodaj do koszyka
                  </button>
                </>
              )}

              {justAdded && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={browseMore}
                    className="min-h-[48px] w-full rounded-lg border-2 border-neutral-700 bg-neutral-800/40 py-3 text-center text-base font-semibold text-neutral-100 hover:bg-neutral-800/60"
                  >
                    Przeglądaj dalej
                  </button>

                  <button
                    type="button"
                    onClick={goCheckout}
                    className="min-h-[48px] w-full rounded-lg bg-blue-600 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    Przejdź do płatności
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

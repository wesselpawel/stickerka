"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/slices/shopSlice";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { getPrice } from "@/lib/getStickerPrice";
import { getStickerPriceBySize } from "@/lib/stickerPricing.js";
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
  const [stickerSize, setStickerSize] = useState<"sticker-s" | "sticker-m" | "sticker-l">("sticker-m");
  const [imageLoading, setImageLoading] = useState(true);

  const unitPrice = useMemo(() => getStickerPriceBySize(stickerSize), [stickerSize]);

  const openModal = useCallback((s: HomeSticker) => {
    setSelected(s);
    setQuantity(1);
    setJustAdded(false);
    setStickerSize("sticker-m");
    setImageLoading(true);
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

  const lineTotal = selected ? getPrice(quantity, stickerSize).sumAfterDiscount : 0;

  const handleAddToCart = () => {
    if (!selected?.title) return;
    dispatch(
      setCart({
        ...selected,
        paperType: "normal",
        size: stickerSize,
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
          <div className="sticker-quick-buy-content">
            <div className="sticker-quick-buy-header">
              <div>
                <h2
                  id="sticker-popup-title"
                  className="text-xl font-bold leading-tight sm:text-2xl"
                >
                  {removeNumbersFromString(selected.title || "")}
                </h2>
                <p className="mt-1 text-sm text-cyan-100/65">Wybierz rozmiar i liczbę sztuk</p>
              </div>
              <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="sticker-quick-buy-close"
                  aria-label="Zamknij"
                >
                  ×
                </button>
            </div>

            <div className="mt-3 sticker-quick-buy-body">
              <div
                className="sticker-stage relative aspect-square overflow-hidden"
                data-sticker-size={stickerSize}
              >
                <Image
                  alt=""
                  src="/desk.jpg"
                  fill
                  sizes="(max-width: 640px) 100vw, 52vw"
                  className="object-cover"
                />
                
                {/* Loader skeleton while image is loading */}
                {img && imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800/40 to-neutral-900/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-4 border-neutral-700/50"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400 animate-spin"></div>
                      </div>
                      <p className="text-sm font-medium text-neutral-300">Ładowanie...</p>
                    </div>
                  </div>
                )}
                
                {img && (
                  <Image
                    src={img}
                    alt={removeNumbersFromString(selected.title || "")}
                    fill
                    sizes="(max-width: 640px) 100vw, 52vw"
                    className={`sticker-image ${stickerSize}`}
                    onLoadingComplete={() => setImageLoading(false)}
                  />
                )}
              </div>

              <div className="sticker-quick-buy-controls">
                <div>
                  <p className="sticker-control-label">Rozmiar</p>
                  <div className="sticker-size-options" role="group" aria-label="Rozmiar naklejki">
                    {[
                      ["sticker-s", "Mała", "6 cm", 7.9],
                      ["sticker-m", "Średnia", "10 cm", 12.9],
                      ["sticker-l", "Duża", "14 cm", 15.9],
                    ].map(([value, label, detail, price]) => (
                      <button
                        key={value}
                        type="button"
                        className={`sticker-size-option ${stickerSize === value ? "is-selected" : ""}`}
                        onClick={() => setStickerSize(value as "sticker-s" | "sticker-m" | "sticker-l")}
                        aria-pressed={stickerSize === value}
                      >
                        <span>{label}</span>
                        <small>{detail}</small>
                        <small className="mt-1 font-semibold text-cyan-100">{getPolishCurrency(Number(price))}</small>
                      </button>
                    ))}
                  </div>
                </div>

                {!justAdded && (
                  <>
                    <div>
                      <p className="sticker-control-label">Ilość</p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="sticker-quantity-button"
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
                        className="sticker-quantity-input"
                        aria-label="Ilość sztuk"
                      />
  
                      <button
                        type="button"
                        className="sticker-quantity-button"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Zwiększ ilość"
                      >
                        +
                      </button>
                    </div>
                    </div>

                    <div className="rounded-2xl border border-chill-line/80 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-3 text-sm text-neutral-200">
                        <span>Cena jednostkowa</span>
                        <span className="font-semibold text-white">{getPolishCurrency(unitPrice)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-sm text-neutral-200">
                        <span>Łącznie</span>
                        <span className="text-lg font-bold text-white">{getPolishCurrency(lineTotal)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="sticker-add-button"
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
          </div>
        )}
      </dialog>
    </>
  );
}

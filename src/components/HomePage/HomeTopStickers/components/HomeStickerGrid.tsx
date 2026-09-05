"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/slices/shopSlice";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { getStickerPriceBySize } from "@/lib/stickerPricing.js";
import { removeNumbersFromString } from "@/lib/removeNumbersFromString";
import StickerTile from "./StickerTile";
import Masonry from "react-masonry-css";
import deskBackground from "../../../../../public/desk.png";

export type HomeSticker = {
  id: string;
  title?: string;
  categories?: string[];
  image_thumbnail?: string;
  image_source?: string;
};

type StickerSize = "sticker-s" | "sticker-m" | "sticker-l";

const stickerSizes: { value: StickerSize; label: string; detail: string }[] = [
  { value: "sticker-s", label: "Mała", detail: "6 cm" },
  { value: "sticker-m", label: "Średnia", detail: "10 cm" },
  { value: "sticker-l", label: "Duża", detail: "14 cm" },
];

export default function HomeStickerGrid({ items }: { items: HomeSticker[] }) {
  const dispatch = useDispatch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [selected, setSelected] = useState<HomeSticker | null>(null);
  const [quantities, setQuantities] = useState<Record<StickerSize, number>>({
    "sticker-s": 0,
    "sticker-m": 0,
    "sticker-l": 0,
  });
  const [stickerSize, setStickerSize] = useState<StickerSize>("sticker-m");
  const [imageLoading, setImageLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const totalQuantity = Object.values(quantities).reduce((sum, value) => sum + value, 0);
  const totalPrice = (Object.entries(quantities) as [StickerSize, number][]).reduce(
    (sum, [size, quantity]) => sum + quantity * getStickerPriceBySize(size),
    0,
  );

  const openModal = useCallback((s: HomeSticker) => {
    setSelected(s);
    setQuantities({ "sticker-s": 0, "sticker-m": 0, "sticker-l": 0 });
    setStickerSize("sticker-m");
    setImageLoading(true);
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

  const handleAddToCart = () => {
    if (!selected?.title || totalQuantity < 1) return;

    (Object.entries(quantities) as [StickerSize, number][]).forEach(([size, quantity]) => {
      if (quantity < 1) return;
      dispatch(
        setCart({
          ...selected,
          paperType: "normal",
          size,
          quantity,
          price: quantity * getStickerPriceBySize(size),
        }),
      );
    });
    setJustAdded(true);
    toast.success(
      `Dodano ${totalQuantity} ${totalQuantity === 1 ? "naklejkę" : "naklejek"} do koszyka`,
      { containerId: "quick-buy-toast", autoClose: 2500, closeOnClick: true },
    );
  };

  const continueBrowsing = () => {
    dialogRef.current?.close();
  };

  const openCart = () => {
    dialogRef.current?.close();
    window.setTimeout(() => {
      window.dispatchEvent(new Event("sticker-cart-open"));
    }, 180);
  };

  const img = selected?.image_thumbnail || selected?.image_source || "";

  const breakpointColumnsObj = {
    default: 7,
    1800: 7,
    1536: 6,
    1280: 5,
    1024: 4,
    800: 3,
    500: 2,
  };

  return (
    <>
      <div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid px-3"
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
          <>
            <ToastContainer
              containerId="quick-buy-toast"
              position="top-center"
              newestOnTop
              closeOnClick
              pauseOnFocusLoss={false}
            />
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
                  src={deskBackground}
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
                  <div className="sticker-size-options" role="group" aria-label="Rozmiar naklejki">
                    {stickerSizes.map(({ value, label, detail }) => (
                      <button
                        key={value}
                        type="button"
                        className={`sticker-size-option ${stickerSize === value ? "is-selected" : ""}`}
                        onClick={() => setStickerSize(value)}
                        aria-pressed={stickerSize === value}
                      >
                        <span>{label}</span>
                        <small>{detail} · {getPolishCurrency(getStickerPriceBySize(value))}/szt.</small>
                      </button>
                      ))}
                    </div>
                  </div>

                  <div className="sticker-selected-quantity">
                    <p className="sticker-control-label">
                      {/* Naklejka {stickerSizes.find(({ value }) => value === stickerSize)?.label} ILOŚĆ: */}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="sticker-quantity-button"
                        onClick={() => setQuantities((current) => ({
                          ...current,
                          [stickerSize]: Math.max(0, current[stickerSize] - 1),
                        }))}
                        aria-label="Zmniejsz ilość"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={quantities[stickerSize]}
                        onChange={(event) => {
                          const nextValue = Number.parseInt(event.target.value, 10);
                          setQuantities((current) => ({
                            ...current,
                            [stickerSize]: Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue),
                          }));
                        }}
                        className="sticker-quantity-input"
                        aria-label="Ilość sztuk"
                      />
                      <button
                        type="button"
                        className="sticker-quantity-button"
                        onClick={() => setQuantities((current) => ({
                          ...current,
                          [stickerSize]: current[stickerSize] + 1,
                        }))}
                        aria-label="Zwiększ ilość"
                      >
                        +
                      </button>
                    </div>
                  </div>
{justAdded ? (
                  <div className="sticker-added-actions" role="status" aria-live="polite">
                    <p className="sticker-added-message">
                      Dodano {totalQuantity} {totalQuantity === 1 && "naklejkę"} {totalQuantity > 1 && totalQuantity < 5 && "naklejki"} {(totalQuantity >= 5 || totalQuantity === 0) && "naklejek"} do koszyka
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={continueBrowsing}
                        className="sticker-secondary-button"
                      >
                        Przeglądaj dalej
                      </button>
                      <button
                        type="button"
                        onClick={openCart}
                        className="sticker-add-button"
                      >
                        Zobacz koszyk
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={totalQuantity === 0}
                    className="sticker-add-button disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Dodaj do koszyka · {getPolishCurrency(totalPrice)}
                  </button>
                )}
                <div className="sticker-total" aria-live="polite">
                  <span>Razem: </span>{totalQuantity}  {totalQuantity === 1 && "naklejka"} {totalQuantity > 1 && totalQuantity < 5 && "naklejki"} {(totalQuantity >= 5 || totalQuantity === 0) && "naklejek"} · {getPolishCurrency(totalPrice)}
                {totalQuantity > 1 && (
                  <div className="sticker-total-breakdown" aria-label="Podsumowanie rozmiarów naklejek">
                    {(Object.entries(quantities) as [StickerSize, number][]).map(([size, quantity]) => {
                      if (quantity < 1) return null;
                      const label = stickerSizes.find((option) => option.value === size)?.label;
                      return (
                        <div key={size} className="flex items-center justify-between gap-4 text-sm text-cyan-100/65">
                          <span>{label}: {quantity} szt.</span>
                          <span>{getPolishCurrency(quantity * getStickerPriceBySize(size))}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                </div>


                
              </div>
            </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

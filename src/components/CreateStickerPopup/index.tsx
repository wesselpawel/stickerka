"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { registerCustomStickerUpload, storage } from "@/firebase";
import { setCart } from "@/redux/slices/shopSlice";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { getStickerPriceBySize, type Size } from "@/lib/getStickerPrice";
import { toast } from "react-toastify";
import deskBackground from "../../../public/desk.png";

const MAX_BYTES = 15 * 1024 * 1024;
const stickerSizes: { value: Size; label: string; detail: string }[] = [
  { value: "sticker-s", label: "Mała", detail: "6,99 zł" },
  { value: "sticker-m", label: "Średnia", detail: "9,99 zł" },
  { value: "sticker-l", label: "Duża", detail: "12,99 zł" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateStickerPopup({ open, onOpenChange }: Props) {
  const dispatch = useDispatch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<Size, number>>({
    "sticker-s": 0,
    "sticker-m": 0,
    "sticker-l": 0,
  });
  const [stickerSize, setStickerSize] = useState<Size>("sticker-m");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selected = open;

  const handleDialogClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

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

  useEffect(() => {
    if (!open) {
      setFile(null);
      setQuantities({ "sticker-s": 0, "sticker-m": 0, "sticker-l": 0 });
      setStickerSize("sticker-m");
      setUploading(false);
      setError("");
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const onPickFile = (f: File | null) => {
    setError("");
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Wybierz plik graficzny (JPG, PNG, WebP itd.).");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("Plik jest za duży (max 15 MB).");
      return;
    }
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setFile(f);
  };

  const totalQuantity = Object.values(quantities).reduce((sum, value) => sum + value, 0);
  const totalPrice = (Object.entries(quantities) as [Size, number][]).reduce(
    (sum, [size, quantity]) => sum + quantity * getStickerPriceBySize(size),
    0,
  );

  const addToCart = async () => {
    if (!file) {
      setError("Najpierw wybierz obrazek.");
      return;
    }
    const customStickerId = uuidv4();
    const safeName = (file.name || "upload")
      .replace(/[^\w.\-]+/g, "_")
      .slice(0, 120);
    const storagePath = `custom-stickers/${customStickerId}/${safeName}`;

    setUploading(true);
    setError("");
    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file, {
        contentType: file.type || "application/octet-stream",
      });
      const downloadURL = await getDownloadURL(storageRef);

      let firestoreUploadId = "";
      try {
        firestoreUploadId = await registerCustomStickerUpload({
          downloadURL,
          storagePath,
          originalFileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        });
      } catch (e) {
        console.error("registerCustomStickerUpload", e);
        toast.warn(
          "Grafika zapisana w magazynie. Jeśli coś pójdzie nie tak, napisz do nas — powiemy jak dosłać plik."
        );
      }

      (Object.entries(quantities) as [Size, number][]).forEach(([size, quantity]) => {
        if (quantity < 1) return;
        const cartLineId = `${customStickerId}-${size}`;
        dispatch(
          setCart({
            id: cartLineId,
            customStickerId: cartLineId,
            isCustomSticker: true,
            title: "Własna naklejka",
            categories: ["wlasna-naklejka"],
            image_source: downloadURL,
            image_thumbnail: downloadURL,
            paperType: "normal",
            size,
            quantity,
            price: quantity * getStickerPriceBySize(size),
            originalFileName: file.name,
            firestoreUploadId: firestoreUploadId || undefined,
          }),
        );
      });

      toast.success("Dodano własną naklejkę do koszyka", {
        autoClose: 3500,
        closeOnClick: true,
      });
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      setError("Nie udało się wysłać pliku. Spróbuj ponownie.");
      toast.error("Błąd przesyłania pliku");
    } finally {
      setUploading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="create-sticker-dialog font-sans text-chill-ink"
      onClose={handleDialogClose}
      aria-labelledby="create-sticker-title"
    >
      {open && (
        <div className="sticker-quick-buy-content">
          <div className="sticker-quick-buy-header">
            <div className="flex w-full items-start justify-between gap-3">
              <div>
                <h2
                  id="create-sticker-title"
                  className="text-xl font-bold leading-tight sm:text-2xl"
                >
                  Stwórz naklejkę
                </h2>
                
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
          </div>

          <div className="sticker-create-body">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="sticker-stage relative aspect-square overflow-hidden"
              data-sticker-size={stickerSize}
              aria-label={previewUrl ? "Zmień przesłaną grafikę" : "Prześlij grafikę"}
            >
              <Image alt="" src={deskBackground} fill sizes="(max-width: 700px) 100vw, 52vw" className="object-cover" />
              <Image
                src={previewUrl || "/questionMark.png"}
                alt={previewUrl ? "Podgląd przesłanej grafiki" : "Miejsce na grafikę naklejki"}
                fill
                unoptimized={Boolean(previewUrl)}
                sizes="(max-width: 700px) 100vw, 52vw"
                className={`sticker-image ${stickerSize}`}
              />
              {!previewUrl && (
                <span className="absolute inset-x-4 bottom-4 z-10 rounded-xl bg-black/75 px-4 py-3 text-center text-sm font-bold text-white shadow-lg">
                  Kliknij, aby przesłać zdjęcie
                </span>
              )}
            </button>

            <div className="sticker-quick-buy-controls">
              {previewUrl ? (
                <div className="space-y-3">
                  <p className="text-sm text-cyan-100/65">Podgląd Twojej naklejki.</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">Zmień plik</button>
                    <button type="button" onClick={() => { setFile(null); setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; }); }} className="rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-cyan-100/65 underline-offset-4 hover:text-white hover:underline">Usuń</button>
                  </div>
                  {file && <p className="text-xs text-cyan-100/55">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>
              ) : (
                <div>
                  <p className="sticker-control-label">Grafika naklejki</p>
                  <p className="text-sm text-cyan-100/65">Prześlij zdjęcie, ilustrację lub logo.</p>
                </div>
              )}

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
                      <small>{detail}</small>
                    </button>
                  ))}
                </div>
              </div>

              {error ? <p className="text-sm font-medium text-red-300" role="alert">{error}</p> : null}

            <div className="sticker-selected-quantity">
              <p className="sticker-control-label">
                Naklejka {stickerSizes.find(({ value }) => value === stickerSize)?.label} ILOŚĆ:
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
                id="create-sticker-qty"
                type="number"
                min={0}
                inputMode="numeric"
                value={quantities[stickerSize]}
                onChange={(e) => {
                  const nextValue = Number.parseInt(e.target.value, 10);
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

            <div className="sticker-total" aria-live="polite">
              <span>Razem: </span>{totalQuantity} {totalQuantity === 1 && "naklejka"} {totalQuantity > 1 && totalQuantity < 5 && "naklejki"} {(totalQuantity >= 5 || totalQuantity === 0) && "naklejek"} · {getPolishCurrency(totalPrice)}
            </div>

            {totalQuantity > 1 && (
              <div className="sticker-total-breakdown" aria-label="Podsumowanie rozmiarów naklejek">
                {(Object.entries(quantities) as [Size, number][]).map(([size, quantity]) => {
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
            
            <button
              type="button"
              disabled={!file || uploading || totalQuantity === 0}
              onClick={addToCart}
              className="sticker-add-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Przesyłanie…" : "Dodaj do koszyka"}
            </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

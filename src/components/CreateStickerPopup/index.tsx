"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { registerCustomStickerUpload, storage } from "@/firebase";
import { setCart } from "@/redux/slices/shopSlice";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { getPrice } from "@/lib/getStickerPrice";
import { STICKER_UNIT_PRICE_PLN } from "@/lib/stickerPricing.js";
import { toast } from "react-toastify";

const MAX_BYTES = 15 * 1024 * 1024;

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
  const [quantity, setQuantity] = useState(1);
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
      setQuantity(1);
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

  const lineTotal = getPrice(quantity).sumAfterDiscount;

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

      dispatch(
        setCart({
          id: customStickerId,
          customStickerId,
          isCustomSticker: true,
          title: "Własna naklejka",
          categories: ["wlasna-naklejka"],
          image_source: downloadURL,
          image_thumbnail: downloadURL,
          paperType: "normal",
          quantity,
          originalFileName: file.name,
          firestoreUploadId: firestoreUploadId || undefined,
        })
      );

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
        <div className="flex max-h-[min(92dvh,44rem)] flex-col overflow-hidden">
          <div className="sticky top-0 z-10 border-b border-chill-line bg-chill-cream/95 px-4 py-3 backdrop-blur sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="create-sticker-title"
                  className="font-display text-lg font-semibold text-chill-ink"
                >
                  Stwórz naklejkę
                </h2>
                <p className="mt-0.5 text-xs text-chill-muted">
                  Prześlij grafikę — drukujemy 1:1 (max 15 MB).{" "}
                  <span className="font-semibold text-chill-ink">
                    {STICKER_UNIT_PRICE_PLN} zł / szt.
                  </span>
                </p>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="min-h-[40px] shrink-0 rounded-lg border border-chill-line bg-white px-3 text-sm font-medium text-chill-ink hover:bg-chill-sand"
                aria-label="Zamknij"
              >
                Zamknij
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />

            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[160px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-chill-line bg-chill-sand/30 px-4 py-8 text-center transition-colors hover:border-chill-sage hover:bg-chill-sand/50"
              >
                <span className="text-sm font-semibold text-chill-ink">
                  Kliknij, aby wybrać obrazek
                </span>
                <span className="mt-1 text-xs text-chill-muted">
                  JPG, PNG, WebP… — zachowujemy jakość pliku do druku
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative mx-auto aspect-square w-full max-w-[min(260px,72vw)] overflow-hidden rounded-xl border border-chill-line bg-chill-sand/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Podgląd przesłanej grafiki"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-chill-line bg-white px-3 py-2 text-sm font-medium text-chill-ink hover:bg-chill-sand"
                  >
                    Zmień plik
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return null;
                      });
                    }}
                    className="rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-chill-muted underline-offset-4 hover:text-chill-ink hover:underline"
                  >
                    Usuń
                  </button>
                </div>
                {file && (
                  <p className="text-center text-xs text-chill-muted">
                    {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            )}

            {error ? (
              <p className="mt-3 text-center text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="sticky bottom-0 z-10 border-t border-chill-line bg-chill-cream/95 px-4 py-2.5 backdrop-blur sm:px-5">
            <label htmlFor="create-sticker-qty" className="sr-only">
              Ilość
            </label>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-chill-ink text-base font-bold"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Zmniejsz ilość"
              >
                −
              </button>
              <input
                id="create-sticker-qty"
                type="number"
                min={1}
                inputMode="numeric"
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!Number.isNaN(v) && v >= 1) setQuantity(v);
                }}
                className="min-h-[36px] w-14 rounded-lg border border-chill-line px-2 text-center text-base font-semibold"
                aria-label="Ilość sztuk"
              />
              <button
                type="button"
                className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-chill-ink text-base font-bold"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Zwiększ ilość"
              >
                +
              </button>
            </div>
            <p className="mt-1 text-center text-sm font-bold text-chill-ink">
              Razem: {getPolishCurrency(lineTotal)}
            </p>
            <button
              type="button"
              disabled={!file || uploading}
              onClick={addToCart}
              className="mt-2 min-h-[44px] w-full rounded-xl bg-chill-sage-dark py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-chill-sage disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Przesyłanie…" : "Dodaj do koszyka"}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { FaArrowRight, FaBold, FaItalic, FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { registerRelatableStickerCreation, storage } from "@/firebase";
import { setCart } from "@/redux/slices/shopSlice";
import { getStickerPriceBySize, type Size } from "@/lib/getStickerPrice";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { toast } from "react-toastify";
import { useCartQuantityFlow } from "@/components/Cart/CartQuantityFlow";

type Position = "top" | "center" | "bottom";
type LineKey = "top" | "bottom";
type LineConfig = {
  text: string;
  visible: boolean;
  position: Position;
  fontSize: number;
  bold: boolean;
  italic: boolean;
};
type Configuration = {
  background: string;
  backgroundAsset: string | null;
  top: LineConfig;
  bottom: LineConfig;
};

const MAX_BACKGROUND_BYTES = 15 * 1024 * 1024;
const INITIAL_RESOURCE_COUNT = 9;
const stickerOptions: { size: Size; label: string; dimension: string }[] = [
  { size: "sticker-s", label: "Mała", dimension: "6 cm" },
  { size: "sticker-m", label: "Duża", dimension: "10 cm" },
];
const catalogOptions: { size: Size; label: string; dimension: string }[] = [
  { size: "sticker-s", label: "Mała", dimension: "6 cm" },
  { size: "sticker-m", label: "Średnia", dimension: "10 cm" },
  { size: "sticker-l", label: "Duża", dimension: "14 cm" },
];
const createInitialConfiguration = (backgroundAssets: string[]): Configuration => ({
  background: "#f4f4f5",
  backgroundAsset: backgroundAssets[0] ?? null,
  top: {
    text: "POV: kiedy miało być szybko",
    visible: true,
    position: "top",
    fontSize: 58,
    bold: true,
    italic: false,
  },
  bottom: {
    text: "a wyszło jak zawsze",
    visible: true,
    position: "bottom",
    fontSize: 52,
    bold: true,
    italic: false,
  },
});

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && context.measureText(candidate).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function drawSticker(canvas: HTMLCanvasElement, configuration: Configuration) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const size = 1200;
  canvas.width = size;
  canvas.height = size;
  context.clearRect(0, 0, size, size);
  if (configuration.backgroundAsset) {
    const image = new window.Image();
    image.src = configuration.backgroundAsset;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Nie udało się wczytać tła."));
    });
    const scale = Math.max(size / image.width, size / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
  } else {
    context.fillStyle = configuration.background;
    context.fillRect(0, 0, size, size);
  }

  for (const line of [configuration.top, configuration.bottom]) {
    if (line.visible === false || !line.text.trim()) continue;
    const fontStyle = line.italic ? "italic" : "normal";
    const fontWeight = line.bold ? "800" : "400";
    const font = `${fontStyle} ${fontWeight} ${line.fontSize}px Arial, sans-serif`;
    context.font = font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    const lines = wrapText(context, line.text, size - 120);
    const lineHeight = line.fontSize * 1.15;
    const blockHeight = lines.length * lineHeight;
    const centerY = line.position === "top" ? 150 : line.position === "bottom" ? 1050 : 600;
    const startY = centerY - blockHeight / 2 + lineHeight / 2;
    lines.forEach((text, index) => {
      const y = startY + index * lineHeight;
      context.lineWidth = Math.max(8, line.fontSize * 0.14);
      context.strokeStyle = "#ffffff";
      context.strokeText(text, size / 2, y);
      context.fillStyle = "#18181b";
      context.fillText(text, size / 2, y);
    });
  }
}

export default function RelatableStickerCreatorButton({
  backgroundAssets,
}: {
  backgroundAssets: string[];
}) {
  const dispatch = useDispatch();
  const { openQuantityPicker } = useCartQuantityFlow();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const catalogDialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const catalogCloseButtonRef = useRef<HTMLButtonElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeLine, setActiveLine] = useState<LineKey>("top");
  const [configuration, setConfiguration] = useState<Configuration>(() =>
    createInitialConfiguration(backgroundAssets)
  );
  const [saving, setSaving] = useState(false);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<string | null>(null);
  const [showAllResources, setShowAllResources] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedCatalogAsset, setSelectedCatalogAsset] = useState(backgroundAssets[0] ?? null);
  const [selectedCatalogSize, setSelectedCatalogSize] = useState<Size>("sticker-m");

  const activeConfig = configuration[activeLine];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = catalogDialogRef.current;
    if (!dialog) return;
    if (catalogOpen && !dialog.open) {
      dialog.showModal();
      catalogCloseButtonRef.current?.focus();
    } else if (!catalogOpen && dialog.open) {
      dialog.close();
    }
  }, [catalogOpen]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    drawSticker(canvasRef.current!, configuration).catch((error) => {
      if (!cancelled) {
        console.error(error);
        toast.error("Nie udało się wczytać wybranego tła.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [configuration, open]);

  const close = useCallback(() => setOpen(false), []);
  const closeCatalog = useCallback(() => setCatalogOpen(false), []);

  const updateActiveLine = (patch: Partial<LineConfig>) => {
    setConfiguration((current) => ({
      ...current,
      [activeLine]: { ...current[activeLine], ...patch },
    }));
  };

  const selectUploadedBackground = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Wybierz plik graficzny (JPG, PNG, WebP itd.).");
      return;
    }
    if (file.size > MAX_BACKGROUND_BYTES) {
      toast.error("Zdjęcie jest za duże (maksymalnie 15 MB).");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setBackgroundPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return previewUrl;
    });
    setBackgroundFile(file);
    setConfiguration((current) => ({ ...current, backgroundAsset: previewUrl }));
  };

  const selectResource = (asset: string) => {
    setBackgroundPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setBackgroundFile(null);
    setConfiguration((current) => ({ ...current, backgroundAsset: asset }));
  };

  const selectColorBackground = () => {
    setBackgroundPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setBackgroundFile(null);
    setConfiguration((current) => ({ ...current, backgroundAsset: null }));
  };

  const saveSticker = async (size: Size, quantity: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    const creationId = uuidv4();
    const storagePath = `relatable-stickers/${creationId}/sticker.png`;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Nie udało się przygotować obrazu.");
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, blob, { contentType: "image/png" });
      const downloadURL = await getDownloadURL(storageRef);
      let savedBackgroundAsset = configuration.backgroundAsset;
      if (backgroundFile) {
        const safeBackgroundName = (backgroundFile.name || "background")
          .replace(/[^\w.\-]+/g, "_")
          .slice(0, 120);
        const backgroundStoragePath = `relatable-stickers/${creationId}/background/${safeBackgroundName}`;
        const backgroundStorageRef = ref(storage, backgroundStoragePath);
        await uploadBytes(backgroundStorageRef, backgroundFile, {
          contentType: backgroundFile.type || "application/octet-stream",
        });
        savedBackgroundAsset = await getDownloadURL(backgroundStorageRef);
      }
      const creationDocumentId = await registerRelatableStickerCreation({
        downloadURL,
        storagePath,
        configuration: { ...configuration, backgroundAsset: savedBackgroundAsset },
      });
      dispatch(
        setCart({
          id: creationId,
          customStickerId: creationId,
          isCustomSticker: true,
          isRelatableSticker: true,
          title: "Relatable naklejka",
          categories: ["relatable-naklejka"],
          image_source: downloadURL,
          image_thumbnail: downloadURL,
          paperType: "normal",
          size,
          quantity,
          price: quantity * getStickerPriceBySize(size),
          firestoreUploadId: creationDocumentId,
          relatableConfiguration: { ...configuration, backgroundAsset: savedBackgroundAsset },
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się zapisać naklejki. Spróbuj ponownie.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const requestSaveSticker = (size: Size) => {
    openQuantityPicker({
      unitPrice: getStickerPriceBySize(size),
      onConfirm: (quantity) => saveSticker(size, quantity),
    });
  };

  const addCatalogStickerToCart = (quantity: number) => {
    if (!selectedCatalogAsset) return;
    const assetId = selectedCatalogAsset.split("/").pop() ?? "relatable";
    const price = quantity * getStickerPriceBySize(selectedCatalogSize);
    dispatch(
      setCart({
        id: `relatable-catalog-${assetId}-${selectedCatalogSize}`,
        customStickerId: `relatable-catalog-${assetId}-${selectedCatalogSize}`,
        isCustomSticker: true,
        isRelatableSticker: true,
        title: "Relatable sticker",
        categories: ["relatable-naklejka"],
        image_source: selectedCatalogAsset,
        image_thumbnail: selectedCatalogAsset,
        paperType: "normal",
        size: selectedCatalogSize,
        quantity,
        price,
      })
    );
  };

  const requestCatalogStickerToCart = () => {
    if (!selectedCatalogAsset) return;
    openQuantityPicker({
      unitPrice: getStickerPriceBySize(selectedCatalogSize),
      onConfirm: (quantity) => addCatalogStickerToCart(quantity),
    });
  };

  return (
    <>
      {/* <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:w-max max-w-full group relative flex justify-end min-h-56 flex-col overflow-hidden rounded-2xl border border-chill-sage/40 bg-gradient-to-br from-chill-sage to-chill-sea p-5 text-left text-white shadow-md shadow-chill-sea/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-chill-sea/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chill-sage focus-visible:ring-offset-2 sm:p-6"
      >
        <span
          className="absolute right-0 top-0 h-full w-1/3 bg-white/10 [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)]"
          aria-hidden
        />

        <span className="relative mt-6">
          <span className="block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/75">
            Kreator naklejek
          </span>
          <span className="mt-1 block font-display text-2xl font-semibold leading-tight sm:text-3xl">
            Własne wlepy
          </span>
          <span className="mt-2 block max-w-xs text-sm leading-relaxed text-white/80">
            Tło, tekst i styl. Gotowy projekt dodasz prosto do koszyka.
          </span>
          <span className="mt-4 inline-flex items-center gap-2 border-b border-white/60 pb-1 text-sm font-bold text-white">
            Otwórz kreator{" "}
            <FaArrowRight
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </span>
        </span>
      </button> */}
      <div
        onClick={() => setCatalogOpen(true)}
        className="cursor-pointer lg:w-max max-w-full group relative flex justify-end min-h-56 flex-col overflow-hidden rounded-2xl border border-chill-sage/40 bg-gradient-to-br from-orange-600 to-orange-700 p-5 text-left text-white shadow-md shadow-chill-sea/15 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chill-sage focus-visible:ring-offset-2 sm:p-6"
      >
        <div className="grid grid-cols-3 gap-2">
          {backgroundAssets
            .slice(0, showAllResources ? backgroundAssets.length : INITIAL_RESOURCE_COUNT)
            .map((asset) => (
              // display 8 images
              <button
                key={asset}
                type="button"
                onClick={() => setSelectedCatalogAsset(asset)}
                className={`z-10 relative aspect-square w-full overflow-hidden rounded-lg border theme-border transition duration-200 hover:shadow-md ${selectedCatalogAsset === asset ? "ring-[3px] ring-green-500" : ""}`}
                aria-label="Wybierz naklejkę"
              >
                <Image
                  src={asset}
                  alt="Relatable sticker"
                  width={320}
                  height={320}
                  className="aspect-square w-full object-cover transition-transform"
                />
              </button>
            ))}
        </div>

        <span
          className="absolute right-0 top-0 h-full w-1/3 bg-white/10 [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)]"
          aria-hidden
        />

        <span className="relative mt-6">
          <span className="block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/75">
            stickerka react
          </span>
          <span className="mt-1 block font-display text-2xl font-semibold leading-tight sm:text-3xl">
            Gorące wlepy
          </span>
          <span className="mt-2 block max-w-xs text-sm leading-relaxed text-white/80">
            Hity, virale i reakcje w formie naklejek. Jaką zamówisz?
          </span>
          <span className="mt-4 inline-flex items-center gap-2 border-b border-white/60 pb-1 text-sm font-bold text-white">
            Już od 6,99 zł/szt{" "}
            <FaArrowRight
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </span>
        </span>
      </div>
      {/* <button
        type="button"
        onClick={() => setCatalogOpen(true)}
        className="group flex w-full max-w-sm items-end gap-3 rounded-2xl border border-chill-sage/50 bg-gradient-to-r from-chill-sage to-chill-sea p-6  text-left text-white shadow-md shadow-chill-sea/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-chill-sea/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chill-sage focus-visible:ring-offset-2"
      >
        <span className="min-w-0">
          <span className="block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/75">
            gotowe wlepy
          </span>
          <span className="mt-1 block font-display text-2xl font-semibold leading-tight">
            Zobacz co zamówili
          </span>
          <span className="mt-0.5 block text-xs text-white/80">
            Podejrzyj gotowe stickerki i wybierz rozmiar
          </span>
        </span>
        <FaArrowRight
          className="ml-auto shrink-0 text-sm text-white transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </button> */}

      <dialog
        ref={catalogDialogRef}
        className="relatable-sticker-dialog theme-surface theme-text w-[min(94vw,920px)] rounded-3xl border theme-border p-0 shadow-2xl"
        onClose={closeCatalog}
        aria-labelledby="relatable-catalog-title"
      >
        <div className="flex max-h-[90dvh] flex-col overflow-y-auto overscroll-contain">
          <header className="theme-surface sticky left-0 top-0 z-50 flex items-center justify-between border-b theme-border px-5 py-4 sm:px-7">
            <div>
              <p className="theme-muted text-xs font-bold uppercase tracking-[0.18em]">
                Stickerka React
              </p>
              <h2 id="relatable-catalog-title" className="font-display text-2xl font-semibold">
                Wlepy na czasie
              </h2>
            </div>
            <button
              ref={catalogCloseButtonRef}
              type="button"
              onClick={closeCatalog}
              className="theme-surface-muted theme-text flex h-10 w-10 items-center justify-center rounded-full border theme-border text-xl"
              aria-label="Zamknij katalog"
            >
              <FaTimes />
            </button>
          </header>

          <div className="px-4 flex flex-col lg:flex-row-reverse lg:items-start">
            <div className="mt-4 grid grid-cols-2 pb-12 gap-3 sm:grid-cols-3">
              {backgroundAssets.map((asset, index) => (
                <button
                  key={asset}
                  type="button"
                  onClick={() => setSelectedCatalogAsset(asset)}
                  className={`group overflow-hidden rounded-2xl border theme-border text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${selectedCatalogAsset === asset ? "scale-[1.02] ring-[6px] ring-green-500" : ""}`}
                  aria-label={`Podejrzyj sticker ${index + 1}`}
                  aria-pressed={selectedCatalogAsset === asset}
                >
                  <Image
                    src={asset}
                    alt={`Relatable sticker ${index + 1}`}
                    width={320}
                    height={320}
                    className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
            <div className="lg:mr-4 lg:mt-4 absolute lg:sticky bottom-0 w-max z-50 flex flex-col items-start px-2 shadow-sm lg:sticky lg:top-24 lg:z-auto lg:aspect-square lg:h-auto lg:items-center lg:justify-center lg:bg-transparent lg:p-0 lg:shadow-none lg:dark:bg-transparent">
              {selectedCatalogAsset && (
                <>
                  <div className="flex aspect-square flex-col">
                    <Image
                      src={selectedCatalogAsset}
                      alt="Wybrany relatable sticker"
                      width={500}
                      height={500}
                      className="aspect-square h-[55px] w-[55px] lg:w-[550px] ml-3 lg:ml-0 mt-1 lg:mt-0 lg:rotate-0 rounded-full lg:rounded-xl object-cover  shadow-md transition-all duration-300 lg:h-full lg:rounded-xl  lg:shadow-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="sticky bottom-0 left-0 z-30 w-full border-t theme-border bg-[var(--theme-surface)] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] lg:z-auto lg:border-0 lg:shadow-none">
            <div className="flex w-full flex-row gap-2">
              {catalogOptions.map(({ size, label, dimension }) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedCatalogSize(size)}
                  className={`min-w-0 w-full flex flex-col items-center justify-between rounded-xl border px-2 py-2 text-center text-xs transition-colors sm:px-3 lg:text-sm ${selectedCatalogSize === size ? "border-chill-sage bg-chill-sage text-white" : "theme-border theme-surface"}`}
                  aria-pressed={selectedCatalogSize === size}
                >
                  <div className="font-semibold">
                    <span>
                      {label} · {dimension}
                    </span>
                  </div>{" "}
                  <span>{getPolishCurrency(getStickerPriceBySize(size))}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={requestCatalogStickerToCart}
              disabled={!selectedCatalogAsset}
              className="mt-3 w-full rounded-xl bg-chill-sage px-4 py-3 font-bold text-white shadow-sm transition hover:bg-chill-sage-dark active:scale-[0.99] disabled:opacity-50 sm:mt-4"
            >
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        ref={dialogRef}
        className="relatable-sticker-dialog theme-surface theme-text w-[min(94vw,980px)] rounded-3xl border theme-border p-0 shadow-2xl"
        onClose={close}
        aria-labelledby="relatable-sticker-title"
      >
        <div className="flex max-h-[90dvh] flex-col overflow-y-auto">
          <header className="theme-surface sticky left-0 top-0 z-50 flex items-center justify-between border-b theme-border px-5 py-4 sm:px-7">
            <div>
              <p className="theme-muted text-xs font-bold uppercase tracking-[0.18em]">
                Stickerka studio
              </p>
              <h2 id="relatable-sticker-title" className="font-display text-2xl font-semibold">
                Relatable sticker
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="theme-surface-muted theme-text flex h-10 w-10 items-center justify-center rounded-full border theme-border text-xl"
              aria-label="Zamknij"
            >
              <FaTimes />
            </button>
          </header>
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
            <div className="relative z-0 order-1 h-max lg:sticky lg:top-24 flex items-center justify-center rounded-3xl bg-zinc-100 p-4 dark:bg-zinc-900 sm:p-8">
              <canvas
                ref={canvasRef}
                className="aspect-square w-full max-w-[560px] rounded-2xl shadow-lg"
                aria-label="Podgląd naklejki"
              />
            </div>
            <div className="contents lg:col-start-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-5">
              <div className="order-3 flex flex-col gap-5 lg:order-2">
                <div
                  className="flex rounded-xl border theme-border p-1"
                  role="tablist"
                  aria-label="Edytowany tekst"
                >
                  {(["top", "bottom"] as LineKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveLine(key)}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${activeLine === key ? "bg-chill-sage text-white" : "theme-muted"}`}
                      aria-pressed={activeLine === key}
                    >
                      {key === "top" ? "Górny tekst" : "Dolny tekst"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => updateActiveLine({ visible: !activeConfig.visible })}
                  className="theme-text flex items-center gap-3 text-left"
                  aria-pressed={activeConfig.visible}
                >
                  <span
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border p-1 transition-colors duration-200 ${activeConfig.visible ? "border-chill-sage bg-chill-sage" : "theme-border bg-zinc-300 dark:bg-zinc-700"}`}
                    aria-hidden="true"
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${activeConfig.visible ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </span>
                  <span className="text-sm font-semibold">
                    {activeConfig.visible ? "Tekst widoczny" : "Tekst ukryty"}
                    <span className="theme-muted mt-0.5 block text-xs font-normal">
                      {activeLine === "top" ? "Tekst górny" : "Tekst dolny"}
                    </span>
                  </span>
                </button>
                <label className="flex flex-col gap-2 text-sm font-semibold">
                  Treść {activeLine === "top" ? "górnego" : "dolnego"} tekstu
                  <textarea
                    value={activeConfig.text}
                    onChange={(event) => updateActiveLine({ text: event.target.value })}
                    maxLength={100}
                    rows={3}
                    className="theme-surface-muted theme-text rounded-xl border theme-border p-3 font-normal outline-none focus:border-chill-sage"
                    placeholder="Wpisz tekst..."
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold">
                  Pozycja
                  <select
                    value={activeConfig.position}
                    onChange={(event) =>
                      updateActiveLine({ position: event.target.value as Position })
                    }
                    className="theme-surface-muted theme-text rounded-xl border theme-border p-3"
                  >
                    <option value="top">Góra</option>
                    <option value="center">Środek</option>
                    <option value="bottom">Dół</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold">
                  Rozmiar: {activeConfig.fontSize}px
                  <input
                    type="range"
                    min="28"
                    max="100"
                    value={activeConfig.fontSize}
                    onChange={(event) => updateActiveLine({ fontSize: Number(event.target.value) })}
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateActiveLine({ bold: !activeConfig.bold })}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border theme-border px-3 py-2 text-sm font-semibold ${activeConfig.bold ? "bg-chill-sage text-white" : "theme-surface-muted"}`}
                  >
                    <FaBold aria-hidden /> Pogrubienie
                  </button>
                  <button
                    type="button"
                    onClick={() => updateActiveLine({ italic: !activeConfig.italic })}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border theme-border px-3 py-2 text-sm font-semibold ${activeConfig.italic ? "bg-chill-sage text-white" : "theme-surface-muted"}`}
                  >
                    <FaItalic aria-hidden /> Kursywa
                  </button>
                </div>
                <div
                  className="mt-auto grid gap-2 sm:grid-cols-2"
                  aria-label="Wybierz rozmiar naklejki"
                >
                  {stickerOptions.map(({ size, label, dimension }) => (
                    <button
                      key={size}
                      type="button"
                      disabled={saving}
                      onClick={() => requestSaveSticker(size)}
                      className="group rounded-xl bg-chill-sage px-3 py-3 text-left text-white transition hover:bg-chill-sage-dark disabled:cursor-wait disabled:opacity-60"
                    >
                      <span className="block text-sm font-bold">
                        {saving ? "Zapisywanie..." : "Dodaj do koszyka"}
                      </span>
                      <span className="mt-1 block text-xs font-medium text-white/85">
                        {label} · {dimension} · {getPolishCurrency(getStickerPriceBySize(size))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="order-2 flex flex-col gap-2 text-sm font-semibold lg:order-1">
                <span>Tło naklejki</span>
                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    selectUploadedBackground(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                />
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => backgroundInputRef.current?.click()}
                    className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border theme-border text-center text-[10px] ${backgroundFile ? "ring-2 ring-chill-sage" : "theme-surface-muted theme-muted"}`}
                    aria-label="Dodaj własne zdjęcie jako tło"
                    aria-pressed={Boolean(backgroundFile)}
                  >
                    {backgroundPreviewUrl ? (
                      <Image
                        src={backgroundPreviewUrl}
                        alt="Podgląd własnego tła"
                        width={100}
                        height={100}
                        unoptimized
                        className="aspect-square h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-xl leading-none">+</span>
                        <span>Dodaj zdjęcie</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={selectColorBackground}
                    className={`flex aspect-square items-center justify-center rounded-lg border theme-border text-xs ${!configuration.backgroundAsset ? "ring-2 ring-chill-sage" : "theme-surface-muted"}`}
                    aria-label="Użyj koloru jako tła"
                    aria-pressed={!configuration.backgroundAsset}
                  >
                    <span
                      className="h-7 w-7 rounded-md border border-zinc-300"
                      style={{ backgroundColor: configuration.background }}
                    />
                  </button>
                  {backgroundAssets
                    .slice(0, showAllResources ? undefined : INITIAL_RESOURCE_COUNT)
                    .map((asset, index) => (
                      <button
                        key={asset}
                        type="button"
                        onClick={() => selectResource(asset)}
                        className={`overflow-hidden rounded-lg border theme-border ${configuration.backgroundAsset === asset ? "ring-2 ring-chill-sage" : ""}`}
                        aria-label={`Wybierz tło ${index + 1}`}
                        aria-pressed={configuration.backgroundAsset === asset}
                      >
                        <Image
                          src={asset}
                          alt={`Miniatura tła ${index + 1}`}
                          width={100}
                          height={100}
                          className="aspect-square h-full w-full object-cover"
                        />
                      </button>
                    ))}
                </div>
                {backgroundAssets.length > INITIAL_RESOURCE_COUNT && (
                  <button
                    type="button"
                    onClick={() => setShowAllResources((current) => !current)}
                    className="theme-muted self-start text-xs font-semibold underline underline-offset-4 hover:text-[var(--page-foreground)]"
                  >
                    {showAllResources ? "Pokaż mniej" : "Pokaż więcej"}
                  </button>
                )}
                <label className="theme-muted flex items-center justify-between gap-3 text-xs font-normal">
                  Kolor tła
                  <input
                    type="color"
                    value={configuration.background}
                    onChange={(event) => {
                      selectColorBackground();
                      setConfiguration((current) => ({
                        ...current,
                        background: event.target.value,
                      }));
                    }}
                    className="h-9 w-14 cursor-pointer rounded-lg border theme-border bg-transparent"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { deleteProduct, storage, updateProduct } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

const randomId = require("random-id");

type Sticker = {
  id: string;
  title: string;
  categories: string[];
  image_source?: string;
  image_thumbnail?: string;
};

type EditMode = "page" | "modal";

export default function EditStickerForm({
  sticker,
  mode = "page",
  onClose,
  onSaved,
  onDeleted,
}: {
  sticker: Sticker;
  mode?: EditMode;
  onClose?: () => void;
  onSaved?: () => void | Promise<void>;
  onDeleted?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const isModal = mode === "modal";

  const [title, setTitle] = useState(sticker?.title ?? "");
  const [categories, setCategories] = useState<string[]>(
    Array.isArray(sticker?.categories) ? sticker.categories : []
  );
  const [categoryInput, setCategoryInput] = useState("");

  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Reset state if user navigates between sticker ids.
    setTitle(sticker?.title ?? "");
    setCategories(Array.isArray(sticker?.categories) ? sticker.categories : []);
    setCategoryInput("");
    setNewFile(null);
    setPreviewUrl("");
  }, [sticker?.id]);

  useEffect(() => {
    if (!newFile) return;
    const url = URL.createObjectURL(newFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newFile]);

  const imageFallback = useMemo(() => {
    return sticker.image_thumbnail || sticker.image_source || "";
  }, [sticker.image_source, sticker.image_thumbnail]);

  const handleCategoryInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value.includes(" ")) {
      setCategoryInput(value.replace(/\s/g, ""));
    } else {
      setCategoryInput(value);
    }
  };

  const addCategory = () => {
    const trimmed = categoryInput.trim();
    if (!trimmed) return;
    const normalized = trimmed.replace(/\s/g, "");
    if (!normalized) return;
    if (categories.includes(normalized)) return;
    setCategories((prev) => [...prev, normalized]);
    setCategoryInput("");
  };

  const removeCategory = (idx: number) => {
    setCategories((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const finalTitle = title.trim();
      if (!finalTitle) {
        throw new Error("Tytuł nie może być pusty.");
      }

      let imageSource = sticker.image_source || sticker.image_thumbnail || "";
      let imageThumbnail =
        sticker.image_thumbnail || sticker.image_source || "";

      if (!imageSource) {
        // If the legacy record does not contain images, the user must upload one.
        if (!newFile) throw new Error("Wgraj zdjęcie naklejki.");
      }

      if (newFile) {
        const randId = `image-${randomId(20, "aA0")}`;
        const imageRef = ref(storage, randId);
        await uploadBytes(imageRef, newFile);
        const url = await getDownloadURL(imageRef);
        imageSource = url;
        imageThumbnail = url;
      }

      await updateProduct(sticker.id, {
        title: finalTitle,
        categories,
        image_source: imageSource,
        image_thumbnail: imageThumbnail,
      });

      if (isModal) {
        await onSaved?.();
        onClose?.();
      } else {
        router.push("/admin/shop/stickers");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to save sticker.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Usunąć tę naklejkę? Tej operacji nie da się cofnąć."
    );
    if (!ok) return;

    setSaving(true);
    setError("");
    try {
      await deleteProduct(sticker.id);
      if (isModal) {
        if (onDeleted) {
          await onDeleted();
        } else {
          await onSaved?.();
        }
        onClose?.();
      } else {
        router.push("/admin/shop/stickers");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete sticker.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edytuj naklejkę</h1>
          <p className="mt-2 text-sm text-white/70">
            Zmień tytuł, kategorie lub prześlij nowy obraz.
          </p>
        </div>

        <div className="flex gap-2">
          {isModal ? (
            <button
              type="button"
              onClick={() => onClose?.()}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Zamknij
            </button>
          ) : (
            <Link
              href="/admin/shop/stickers"
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Wróć
            </Link>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-300 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaTrash className="mr-2" />
            Usuń
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-400">{error}</div>}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[420px_1fr]">
        <div className="rounded-xl border border-white/10 bg-[#222430] p-4">
          <div className="relative h-56 w-full overflow-hidden rounded-lg bg-white/5">
            {previewUrl || imageFallback ? (
              <Image
                src={previewUrl || imageFallback}
                alt={title || "Sticker"}
                fill
                className="object-contain"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-white/80">
              Nowe zdjęcie (opcjonalnie)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setNewFile(f);
              }}
              className="mt-2 w-full rounded-md border border-white/15 bg-white/5 p-2 text-sm"
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#222430] p-4">
          <label className="block text-sm font-semibold text-white/80">
            Tytuł naklejki
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/15 bg-white/5 p-2 text-sm"
          />

          <div className="mt-5">
            <label className="block text-sm font-semibold text-white/80">
              Kategorie
            </label>

            <div className="mt-2 flex gap-2">
              <input
                value={categoryInput}
                onChange={handleCategoryInputChange}
                placeholder="np. auta"
                className="flex-1 rounded-md border border-white/15 bg-white/5 p-2 text-sm"
              />
              <button
                type="button"
                onClick={addCategory}
                className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold hover:bg-blue-600"
              >
                Dodaj
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c, idx) => (
                <button
                  key={`${c}-${idx}`}
                  type="button"
                  onClick={() => removeCategory(idx)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                  title="Kliknij aby usunąć"
                >
                  {c} <span className="ml-1 text-white/50">×</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
            {isModal && (
              <button
                type="button"
                onClick={() => onClose?.()}
                disabled={saving}
                className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Zamknij
              </button>
            )}
            <div className="text-xs text-white/60">
              Kategorie i tytuł zapiszą się od razu po kliknięciu.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


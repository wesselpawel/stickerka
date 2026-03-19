"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import EditStickerForm from "./[stickerId]/EditStickerForm";
import { deleteProduct, getProducts } from "@/firebase";
import { FaPen, FaTrash } from "react-icons/fa";

type Sticker = {
  id: string;
  title: string;
  categories: string[];
  image_source?: string;
  image_thumbnail?: string;
};

export default function AdminStickersPage() {
  const [products, setProducts] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingSticker, setEditingSticker] = useState<Sticker | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await getProducts();
      setProducts(res?.products ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load stickers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!editingSticker) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingSticker(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingSticker]);

  const ordered = useMemo(() => {
    // Newest first when createdAt is available; otherwise preserve current order.
    return [...products].sort((a: any, b: any) => {
      const aTime = a?.createdAt?.seconds ?? 0;
      const bTime = b?.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });
  }, [products]);

  const handleDelete = async (stickerId: string) => {
    const ok = window.confirm(
      "Usunąć naklejkę? Tej operacji nie da się cofnąć."
    );
    if (!ok) return;

    try {
      setDeletingId(stickerId);
      await deleteProduct(stickerId);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete sticker.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Zarządzaj naklejkami</h1>
        <p className="mt-2 text-sm text-white/70">
          Edytuj tytuł i kategorie lub usuń naklejkę ze sklepu.
        </p>
      </div>

      {loading && <div className="text-white/70">Ładowanie...</div>}
      {error && <div className="mb-4 text-red-400">{error}</div>}

      {!loading && ordered.length === 0 && (
        <div className="text-white/70">Brak naklejek w bazie.</div>
      )}

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-3">
        {ordered.map((sticker) => {
          const image =
            sticker.image_thumbnail || sticker.image_source || "";
          return (
            <div
              key={sticker.id}
              className="rounded-xl border border-white/10 bg-[#222430] p-4"
            >
              <div className="flex gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-white/5">
                  {image ? (
                    <Image
                      src={image}
                      alt={sticker.title || "Sticker"}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold">
                    {sticker.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(sticker.categories ?? []).map((c) => (
                      <span
                        key={`${sticker.id}-${c}`}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSticker(sticker)}
                      className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#222430] hover:bg-white/90"
                    >
                      <FaPen className="mr-2" />
                      Edytuj
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sticker.id)}
                      disabled={deletingId === sticker.id}
                      className="inline-flex items-center justify-center rounded-md border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-300 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaTrash className="mr-2" />
                      {deletingId === sticker.id ? "Usuwam..." : "Usuń"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingSticker && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingSticker(null)}
        >
          <div
            className="w-full max-w-4xl overflow-auto rounded-xl border border-white/10 bg-[#222430] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <EditStickerForm
              sticker={editingSticker}
              mode="modal"
              onClose={() => setEditingSticker(null)}
              onSaved={load}
              onDeleted={load}
            />
          </div>
        </div>
      )}
    </div>
  );
}


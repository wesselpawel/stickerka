"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { addCollection, deleteCollection, getCollections, getProducts, storage, updateCollection } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

type Sticker = { id: string; title?: string; image_source?: string; image_thumbnail?: string };
type CollectionItem = Sticker & { source: "sticker" | "upload" };
type Collection = { id: string; name: string; description?: string; items: CollectionItem[]; published?: boolean };

const emptyForm = { name: "", description: "", published: true };

export default function CollectionsPage() {
  const [products, setProducts] = useState<Sticker[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [existingUploadedItems, setExistingUploadedItems] = useState<CollectionItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [productResult, collectionResult] = await Promise.all([getProducts(), getCollections()]);
      setProducts((productResult?.products ?? []) as Sticker[]);
      setCollections(collectionResult as Collection[]);
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się wczytać kolekcji.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.includes(product.id)),
    [products, selectedIds]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedIds([]);
    setExistingUploadedItems([]);
    setFiles([]);
    setEditingId(null);
  };

  const editCollection = (collection: Collection) => {
    setEditingId(collection.id);
    setForm({ name: collection.name, description: collection.description ?? "", published: collection.published !== false });
    setSelectedIds(collection.items.filter((item) => item.source === "sticker").map((item) => item.id));
    setExistingUploadedItems(collection.items.filter((item) => item.source !== "sticker"));
    setFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/")));
  };

  const save = async () => {
    if (!form.name.trim()) { setError("Podaj nazwę kolekcji."); return; }
    if (!selectedProducts.length && !files.length && !existingUploadedItems.length) { setError("Dodaj przynajmniej jeden obraz."); return; }
    setSaving(true);
    setError("");
    try {
      const uploadedItems: CollectionItem[] = [];
      for (const file of files) {
        const storageRef = ref(storage, `collections/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedItems.push({ id: `${Date.now()}-${file.name}`, title: file.name, image_source: url, image_thumbnail: url, source: "upload" });
      }
      const items: CollectionItem[] = [
        ...selectedProducts.map((product) => ({ ...product, source: "sticker" as const })),
        ...existingUploadedItems,
        ...uploadedItems,
      ];
      const payload = { name: form.name.trim(), description: form.description.trim(), published: form.published, items };
      if (editingId) await updateCollection(editingId, payload);
      else await addCollection(payload);
      resetForm();
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się zapisać kolekcji.");
    } finally { setSaving(false); }
  };

  const remove = async (collection: Collection) => {
    if (!window.confirm(`Usunąć kolekcję „${collection.name}”?`)) return;
    try { await deleteCollection(collection.id); if (editingId === collection.id) resetForm(); await load(); }
    catch (e: any) { setError(e?.message ?? "Nie udało się usunąć kolekcji."); }
  };

  return (
    <div className="p-6 text-white">
      <div className="mb-6"><h1 className="text-3xl font-bold">Kolekcje</h1><p className="mt-2 text-sm text-white/70">Twórz osobne galerie z istniejących naklejek i nowych obrazów.</p></div>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      <section className="mb-8 rounded-xl border border-white/10 bg-[#2a2c38] p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">{editingId ? "Edytuj kolekcję" : "Nowa kolekcja"}</h2>{editingId && <button type="button" onClick={resetForm} className="text-sm text-white/70 hover:text-white">Anuluj</button>}</div>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nazwa kolekcji" className="rounded-md p-3 text-black" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Krótki opis (opcjonalnie)" className="rounded-md p-3 text-black" />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Widoczna na stronie głównej</label>
        <div className="mt-5"><h3 className="mb-2 font-semibold">Istniejące naklejki</h3><div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-4 lg:grid-cols-6">{products.map((product) => { const image = product.image_thumbnail || product.image_source; return <label key={product.id} className={`cursor-pointer rounded-md border p-2 ${selectedIds.includes(product.id) ? "border-emerald-400 bg-emerald-400/10" : "border-white/10 bg-white/5"}`}><input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => setSelectedIds((ids) => ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id])} className="mr-2" />{image && <Image src={image} alt="" width={80} height={80} className="h-16 w-full object-cover" />}<span className="mt-1 block truncate text-xs">{product.title || "Bez tytułu"}</span></label>; })}</div></div>
        <label className="mt-5 block"><span className="mb-2 block font-semibold">Nowe obrazy</span><input type="file" accept="image/*" multiple onChange={handleFiles} className="text-sm" /></label>
        {files.length > 0 && <p className="mt-2 text-sm text-white/70">Wybrano plików: {files.length}</p>}
        <button type="button" onClick={save} disabled={saving} className="mt-5 inline-flex items-center rounded-md bg-white px-4 py-2 font-semibold text-[#222430] disabled:opacity-50">{editingId ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}{saving ? "Zapisywanie..." : editingId ? "Zapisz zmiany" : "Utwórz kolekcję"}</button>
      </section>
      <h2 className="mb-4 text-xl font-semibold">Zapisane kolekcje</h2>
      {loading ? <p className="text-white/70">Ładowanie...</p> : <div className="grid gap-4 lg:grid-cols-2">{collections.map((collection) => <article key={collection.id} className="rounded-xl border border-white/10 bg-[#222430] p-4"><div className="flex justify-between gap-4"><div><h3 className="text-lg font-semibold">{collection.name}</h3><p className="text-sm text-white/60">{collection.items?.length ?? 0} obrazów · {collection.published === false ? "ukryta" : "opublikowana"}</p></div><div className="flex gap-2"><button type="button" onClick={() => editCollection(collection)} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#222430]"><FaEdit /></button><button type="button" onClick={() => remove(collection)} className="rounded-md border border-red-400/50 px-3 py-2 text-red-300"><FaTrash /></button></div></div><div className="mt-4 grid grid-cols-5 gap-1">{(collection.items ?? []).slice(0, 5).map((item) => <Image key={item.id} src={item.image_thumbnail || item.image_source || ""} alt="" width={100} height={100} className="h-16 w-full object-cover" />)}</div></article>)}</div>}
    </div>
  );
}
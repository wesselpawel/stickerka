"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import HomeStickerGrid, {
  type HomeSticker,
} from "../HomeTopStickers/components/HomeStickerGrid";
import logo from "../../../../public/stickerkalogo.png";

function toStickerTileProps(p: Record<string, unknown>): HomeSticker {
  const categories = Array.isArray((p as any).categories)
    ? (p as any).categories.filter((c: unknown): c is string => typeof c === "string")
    : undefined;

  return {
    id: String((p as any).id ?? ""),
    title: typeof (p as any).title === "string" ? (p as any).title : undefined,
    categories,
    image_thumbnail:
      typeof (p as any).image_thumbnail === "string"
        ? (p as any).image_thumbnail
        : undefined,
    image_source:
      typeof (p as any).image_source === "string" ? (p as any).image_source : undefined,
  };
}

export default function HomeTagFilters({
  products,
  maxItems = 20,
  maxTags = 14,
}: {
  products: ReadonlyArray<{
    id: string;
    title?: string;
    categories?: string[];
    image_thumbnail?: string;
    image_source?: string;
  }>;
  maxItems?: number;
  maxTags?: number;
}) {
  const tiles = useMemo(() => products.map(toStickerTileProps), [products]);

  // SSR-safe: keep item order deterministic (no random shuffling).
  // This avoids server/client hydration mismatches.

  const { sortedTags } = useMemo(() => {
    const counts = new Map<string, number>();

    for (const t of tiles) {
      for (const tag of t.categories ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    const allTags = Array.from(counts.entries()).map(([tag, count]) => ({
      tag,
      count,
    }));

    allTags.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
    return { sortedTags: allTags };
  }, [tiles]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const base =
      activeTag == null
        ? tiles
        : tiles.filter((t) => (t.categories ?? []).includes(activeTag));

    return base.slice(0, maxItems);
  }, [activeTag, tiles, maxItems]);

  const visibleTags = sortedTags.slice(0, maxTags);

  return (
    <section className="border-b border-neutral-800 bg-black/40 text-neutral-100">
      <div className="mx-auto max-w-[1600px] px-3 py-8 md:px-8 md:py-10">
        <Image
          src={logo}
          alt="Stickerka"
          width={200}
          height={200}
          className="mx-auto mb-4 w-[200px]"
        />

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              activeTag == null
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-neutral-700/60 bg-neutral-900/20 text-neutral-100/90 hover:text-white hover:border-neutral-600"
            }`}
          >
            Wszystko
          </button>

          {visibleTags.map(({ tag, count }) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-neutral-700/60 bg-neutral-900/20 text-neutral-100/90 hover:text-white hover:border-neutral-600"
                }`}
                aria-pressed={isActive}
              >
                {tag}{" "}
                <span className="ml-1 text-neutral-200/70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {filteredItems.length > 0 ? (
            <HomeStickerGrid items={filteredItems} />
          ) : (
            <p className="px-2 text-center text-sm text-neutral-600">
              Brak wyników dla wybranego taga.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}


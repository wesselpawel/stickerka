"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HomeStickerGrid, {
  type HomeSticker,
} from "../HomeTopStickers/components/HomeStickerGrid";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

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

const tagButtonClass = (isActive: boolean) =>
  `shrink-0 whitespace-nowrap px-6 py-1 text-xl font-semibold transition-colors ${
    isActive
      ? "bg-chill-sage text-white"
      : "hover:bg-chill-line text-white hover:text-white/70"
  }`;

export default function HomeTagFilters({
  products,
  maxTags = 14,
}: {
  products: ReadonlyArray<{
    id: string;
    title?: string;
    categories?: string[];
    image_thumbnail?: string;
    image_source?: string;
  }>;
  maxTags?: number;
}) {
  const tiles = useMemo(() => products.map(toStickerTileProps), [products]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    if (activeTag == null) return tiles;

    return tiles.filter((t) => (t.categories ?? []).includes(activeTag));
  }, [activeTag, tiles]);

  const visibleTags = sortedTags.slice(0, maxTags);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      resizeObserver.disconnect();
    };
  }, [updateScrollButtons, visibleTags.length]);

  useEffect(() => {
    if (activeTag == null) return;

    scrollRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tag="${CSS.escape(activeTag)}"]`)
      ?.scrollIntoView({ inline: "nearest", behavior: "smooth" });
  }, [activeTag]);

  return (
    <section className="w-full text-neutral-100">
      <h1 className="text-xl text-center md:pt-6 font-bold">
        Wydrukujemy i wyślemy Twoje naklejki w 24 godziny
      </h1>
      <div className="mx-auto w-full py-8">
        <div className="h-16 sticky top-[104px] md:top-[140px] left-0 bg-black z-50 relative w-full">
          {canScrollLeft && (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-chill-sage to-transparent"
              />
              <button
                type="button"
                aria-label="Poprzednie tagi"
                onClick={() => scrollByPage(-1)}
                className="aspect-square flex justify-center absolute left-0 top-1/2 z-10 flex h-full -translate-y-1/2 items-center bg-gradient-to-r from-chill-sage via-chill-mist to-chill-sea px-2 py-1 text-xl font-semibold transition-colors hover:bg-chill-sage/80 hover:text-white/70"
              >
                <FaArrowLeft />
              </button>
            </>
          )}

          {canScrollRight && (
            <>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-chill-sage to-transparent"
              />
              <button
                type="button"
                aria-label="Następne tagi"
                onClick={() => scrollByPage(1)}
                className="aspect-square flex justify-center absolute right-0 top-1/2 z-10 flex h-full -translate-y-1/2 items-center bg-gradient-to-r from-chill-sage via-chill-mist to-chill-sea px-2 py-1 text-xl font-semibold transition-colors hover:bg-gradient-to-r hover:from-chill-sage hover:via-chill-mist hover:to-chill-sea hover:text-white/70"
              >
                <FaArrowRight />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="h-full flex overflow-x-auto scroll-smooth bg-chill-cream [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={tagButtonClass(activeTag == null)}
              aria-pressed={activeTag == null}
            >
              Kategorie
            </button>

            {visibleTags.map(({ tag }) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  data-tag={tag}
                  onClick={() => setActiveTag(tag)}
                  className={tagButtonClass(isActive)}
                  aria-pressed={isActive}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3">
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

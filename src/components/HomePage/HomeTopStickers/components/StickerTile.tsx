"use client";

import Image from "next/image";
import type { HomeSticker } from "./HomeStickerGrid";
import { removeNumbersFromString } from "@/lib/removeNumbersFromString";
import { getPolishCurrency } from "@/lib/getPolishCurrency";

export default function StickerTile({
  sticker,
  onOpen,
  index = 0,
}: {
  sticker: HomeSticker;
  onOpen: () => void;
  index?: number;
}) {
  const src = sticker.image_thumbnail || sticker.image_source || "";
  const title = removeNumbersFromString(sticker.title || "");

  return (
    <div
      role="button"
      tabIndex={0}
      title={sticker.title}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
        if (e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      style={{ animationDelay: `${index * 60}ms` }}
      className="sticker-tile-enter group relative flex w-full cursor-pointer flex-col text-left transition-transform duration-300 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sea/60 focus-visible:ring-offset-0"
    >
      {/* overflow-visible so drop-shadow isn't clipped by the tile frame */}
      <div className="relative aspect-square w-full overflow-visible">
        {src ? (
          <Image
            src={src}
            alt={sticker.title || "Naklejka"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain transition-transform duration-300 ease-out filter drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] group-hover:scale-[1.06] group-hover:drop-shadow-[0_26px_40px_rgba(0,0,0,0.60)]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-neutral-500">
            —
          </span>
        )}
      </div>

      <div className="group-hover:opacity-100 lg:opacity-0 hover:opacity-100 absolute top-3 left-3">
        <span className="min-w-0 bg-black/50 p-1 block truncate text-left text-sm font-semibold leading-tight text-neutral-100/90">
          {getPolishCurrency(20)}
        </span>
      </div>
      <div className="group-hover:opacity-100 opacity-0 hover:opacity-100 absolute bottom-3 left-3">
        <span className="min-w-0 bg-black/50 p-1 block truncate text-left text-sm font-semibold leading-tight text-neutral-100/90">
          { title  || "Naklejka"}
        </span>
      </div>
    </div>
  );
}

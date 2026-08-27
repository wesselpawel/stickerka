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
            className="object-contain transition-transform duration-300 ease-out filter"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-neutral-500">
            —
          </span>
        )}
      </div>
    </div>
  );
}

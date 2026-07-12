"use client";

import { useState } from "react";
import CreateStickerPopup from "@/components/CreateStickerPopup";
import { HOME_STICKER_TYPES } from "./config";

export default function HomeStickerTypes() {
  const [createStickerOpen, setCreateStickerOpen] = useState(false);

  return (
    <>
      <CreateStickerPopup
        open={createStickerOpen}
        onOpenChange={setCreateStickerOpen}
      />

      <ul className="mx-auto mt-6 grid w-full max-w-5xl list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:sticky lg:z-50 lg:grid-cols-3 lg:gap-2 xl:max-w-6xl">
        {HOME_STICKER_TYPES.map(
          ({ id, label, badge, className, hit }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setCreateStickerOpen(true)}
                className={`group relative flex min-h-[3.25rem] w-full items-center gap-2 rounded-xl px-3 py-3 text-left shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:min-h-[3.5rem] sm:gap-2.5 sm:px-4 sm:py-3.5 md:rounded-2xl ${className}`}
              >
              {hit ? (
                <span className="absolute right-3 top-1.5 z-10 rounded-sm bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white animate-bounce sm:right-4 sm:text-xs">
                  HIT!
                </span>
              ) : null}

              <span className="flex h-8 shrink-0 items-center justify-center rounded-md bg-white px-2 text-black/60 sm:h-9">
                {badge}
              </span>

              <span className="min-w-0 flex-1 text-base font-bold leading-tight sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                {label}
              </span>
              </button>
            </li>
          )
        )}
      </ul>
    </>
  );
}

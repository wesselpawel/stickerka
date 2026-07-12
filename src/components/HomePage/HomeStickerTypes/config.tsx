import { FaStar } from "react-icons/fa6";
import type { ReactNode } from "react";

export type HomeStickerTypeConfig = {
  id: string;
  label: string;
  badge: ReactNode;
  /** Tailwind classes for the button surface (background, text, etc.) */
  className: string;
  /** Optional "HIT!" promo pill */
  hit?: boolean;
};

export const HOME_STICKER_TYPES: HomeStickerTypeConfig[] = [
  {
    id: "logo",
    label: "Naklejka z logo",
    badge: (
      <span className="text-base font-extrabold sm:text-lg md:text-xl lg:text-[22px]">
        LOGO
      </span>
    ),
    className: "bg-blue-600 text-white hover:bg-blue-500",
  },
  {
    id: "napis",
    label: "Naklejka napis",
    hit: true,
    badge: (
      <span className="text-sm font-extrabold sm:text-[15px]">ABC</span>
    ),
    className: "bg-yellow-500 text-black hover:bg-yellow-400",
  },
  {
    id: "symbol",
    label: "Naklejka symbol",
    badge: (
      <span className="flex items-center gap-0.5 text-sm sm:text-[15px]">
        <FaStar className="text-black" aria-hidden />
        <FaStar className="text-black" aria-hidden />
        <FaStar className="text-black" aria-hidden />
      </span>
    ),
    className: "bg-black/50 text-white hover:bg-black/70",
  },
];

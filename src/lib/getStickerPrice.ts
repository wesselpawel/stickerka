import {
  STICKER_UNIT_PRICE_PLN,
  lineTotalPln,
} from "@/lib/stickerPricing.js";

/** @deprecated Kept for typings; only one format exists now. */
export type Size = "standard";

export function getPrice(quantity: number, _size?: Size) {
  const sum = lineTotalPln(quantity);
  return { sumBeforeDiscount: sum, sumAfterDiscount: sum };
}

export function getStickerPriceNotification(quantity: number, _size?: Size) {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  if (q < 1) {
    return { notification: "" };
  }
  const total = lineTotalPln(q);
  const notification = `${STICKER_UNIT_PRICE_PLN} zł / szt. · łącznie ${total.toFixed(0)} zł`;
  return { notification };
}

export { STICKER_UNIT_PRICE_PLN, lineTotalPln, cartSubtotalPln } from "@/lib/stickerPricing.js";

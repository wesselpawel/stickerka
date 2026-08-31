import {
  STICKER_UNIT_PRICE_PLN,
  getStickerPriceBySize,
  lineTotalPln,
} from "@/lib/stickerPricing.js";

export type Size = "sticker-s" | "sticker-m" | "sticker-l";

export function getPrice(quantity: number, size: Size = "sticker-m") {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  const sum = lineTotalPln(q, size);
  return { sumBeforeDiscount: sum, sumAfterDiscount: sum };
}

export function getStickerPriceNotification(quantity: number, size: Size = "sticker-m") {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  if (q < 1) {
    return { notification: "" };
  }
  const unitPrice = getStickerPriceBySize(size);
  const total = lineTotalPln(q, size);
  const notification = `${unitPrice.toFixed(2).replace(".", ",")} zł / szt. · łącznie ${total.toFixed(2).replace(".", ",")} zł`;
  return { notification };
}

export { STICKER_UNIT_PRICE_PLN, getStickerPriceBySize, lineTotalPln, cartSubtotalPln } from "@/lib/stickerPricing.js";

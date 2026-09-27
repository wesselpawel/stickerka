import { getStickerPriceBySize } from "@/lib/stickerPricing.js";
import type { Size } from "@/lib/getStickerPrice";

export const COLLECTION_STICKER_SIZE: Size = "sticker-s";

export function getCollectionUnitPrice(stickerCount: number) {
  return Math.max(0, stickerCount) * getStickerPriceBySize(COLLECTION_STICKER_SIZE);
}

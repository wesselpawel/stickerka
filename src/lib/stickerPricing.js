/** Sticker pricing by size, used across shop, cart and checkout. */
export const STICKER_SIZE_PRICES = {
  "sticker-s": 6.99,
  "sticker-m": 9.99,
  "sticker-l": 12.99,
};

export const DEFAULT_STICKER_SIZE = "sticker-m";
export const STICKER_UNIT_PRICE_PLN = STICKER_SIZE_PRICES[DEFAULT_STICKER_SIZE];

export function getStickerPriceBySize(size) {
  const normalized = typeof size === "string" ? size : DEFAULT_STICKER_SIZE;
  const price = STICKER_SIZE_PRICES[normalized] ?? STICKER_SIZE_PRICES[DEFAULT_STICKER_SIZE];
  return Number(price) || 0;
}

export function getQuantityDiscount(quantity) {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  if (q >= 20) return 0.5;
  if (q >= 10) return 0.3;
  if (q >= 5) return 0.2;
  if (q >= 3) return 0.15;
  return 0;
}

export function getDiscountedStickerUnitPrice(size, quantity) {
  return getStickerPriceBySize(size) * (1 - getQuantityDiscount(quantity));
}

export function lineTotalPln(quantity, size = DEFAULT_STICKER_SIZE) {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  return q * getDiscountedStickerUnitPrice(size, q);
}

export function cartItemPieceCount(item) {
  const quantity = Math.max(0, Math.floor(Number(item?.quantity) || 0));
  const piecesPerSet = item?.isCollectionBundle
    ? Math.max(0, Math.floor(Number(item.collectionStickerCount) || 0))
    : 1;
  return quantity * piecesPerSet;
}

export function cartItemTotalPln(item) {
  const size = item?.size || item?.stickerSize || DEFAULT_STICKER_SIZE;
  const quantity = Math.max(0, Math.floor(Number(item?.quantity) || 0));
  if (!item?.isCollectionBundle) return lineTotalPln(quantity, size);
  const stickerCount = Math.max(0, Math.floor(Number(item.collectionStickerCount) || 0));
  return stickerCount * lineTotalPln(quantity, size);
}

export function cartSubtotalPln(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((acc, item) => acc + cartItemTotalPln(item), 0);
}

export function getLowestStickerPriceInCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) return 0;
  const values = cart
    .map((item) => {
      const quantity = Math.max(0, Math.floor(Number(item?.quantity) || 0));
      const size = item?.size || item?.stickerSize || DEFAULT_STICKER_SIZE;
      const piecesPerSet = item?.isCollectionBundle
        ? Math.max(0, Math.floor(Number(item.collectionStickerCount) || 0))
        : 1;
      return Array.from({ length: quantity * piecesPerSet }, () => getStickerPriceBySize(size));
    })
    .flat();

  return values.length ? Math.min(...values) : 0;
}

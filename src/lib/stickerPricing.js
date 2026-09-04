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

export function lineTotalPln(quantity, size = DEFAULT_STICKER_SIZE) {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  return q * getStickerPriceBySize(size);
}

export function cartSubtotalPln(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((acc, item) => {
    const size = item?.size || item?.stickerSize || DEFAULT_STICKER_SIZE;
    return acc + lineTotalPln(item.quantity, size);
  }, 0);
}

export function getLowestStickerPriceInCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) return 0;
  const values = cart
    .map((item) => {
      const quantity = Math.max(0, Math.floor(Number(item?.quantity) || 0));
      const size = item?.size || item?.stickerSize || DEFAULT_STICKER_SIZE;
      return Array.from({ length: quantity }, () => getStickerPriceBySize(size));
    })
    .flat();

  return values.length ? Math.min(...values) : 0;
}

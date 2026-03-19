/** Single SKU: one sticker size, fixed PLN per piece (shop + checkout). */
export const STICKER_UNIT_PRICE_PLN = 20;

export function lineTotalPln(quantity) {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  return q * STICKER_UNIT_PRICE_PLN;
}

export function cartSubtotalPln(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((acc, item) => acc + lineTotalPln(item.quantity), 0);
}

import { listOfPrizes } from "@/components/listOfPrizes";
import {
  STICKER_UNIT_PRICE_PLN,
  cartSubtotalPln,
} from "@/lib/stickerPricing.js";

/** Total number of sticker pieces in the cart (all lines). */
function totalCartPieces(cart: any[]): number {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce(
    (sum, line) => sum + Math.max(0, Math.floor(Number(line?.quantity) || 0)),
    0
  );
}

/**
 * Bundle: every N pieces → one free sticker (20 zł) per complete set.
 * Counts pieces across the whole cart (mixed designs).
 */
function bundleDiscountPln(totalPieces: number, piecesPerFreeSet: number): number {
  if (piecesPerFreeSet < 2) return 0;
  const sets = Math.floor(totalPieces / piecesPerFreeSet);
  return sets * STICKER_UNIT_PRICE_PLN;
}

function resolvePrize(prizeId: unknown) {
  return listOfPrizes.find((prize) => {
    if (prizeId === null || prizeId === undefined) return false;
    if (typeof prizeId === "number" && prize.id === prizeId) return true;
    if (typeof prizeId === "string" && String(prize.id) === prizeId.trim())
      return true;
    const n = Number(prizeId);
    if (!Number.isNaN(n) && prize.id === n) return true;
    return false;
  });
}

export function getFinalPrice(prizeId: any, cart: any) {
  const promotionInfo = resolvePrize(prizeId);

  const cartPrice = cartSubtotalPln(cart);
  const totalPieces = totalCartPieces(cart);

  let message = "Brak promocji";
  let discountedPrice = cartPrice;

  if (promotionInfo) {
    switch (promotionInfo.title) {
      case "Kod promocyjny -25%":
        discountedPrice = cartPrice * 0.75;
        message = "Kod aktywny";
        break;
      case "Kod promocyjny -20%":
        discountedPrice = cartPrice * 0.8;
        message = "Kod aktywny";
        break;
      case "Kod promocyjny -15%":
        discountedPrice = cartPrice * 0.85;
        message = "Kod aktywny";
        break;
      case "Kod promocyjny -10%":
        discountedPrice = cartPrice * 0.9;
        message = "Kod aktywny";
        break;

      case "3 + 1 darmowa": {
        const discount = bundleDiscountPln(totalPieces, 4);
        const ok = discount > 0;
        discountedPrice = cartPrice - discount;
        message = ok
          ? "Kod aktywny"
          : `Ten kod wymaga co najmniej 4 naklejek w koszyku (masz ${totalPieces}).`;
        break;
      }
      case "4 + 1 darmowa": {
        const discount = bundleDiscountPln(totalPieces, 5);
        const ok = discount > 0;
        discountedPrice = cartPrice - discount;
        message = ok
          ? "Kod aktywny"
          : `Ten kod wymaga co najmniej 5 naklejek w koszyku (masz ${totalPieces}).`;
        break;
      }
      case "5 + 1 darmowa": {
        const discount = bundleDiscountPln(totalPieces, 6);
        const ok = discount > 0;
        discountedPrice = cartPrice - discount;
        message = ok
          ? "Kod aktywny"
          : `Ten kod wymaga co najmniej 6 naklejek w koszyku (masz ${totalPieces}).`;
        break;
      }
      default:
        break;
    }
  }

  return {
    finalPrice: Math.max(0, discountedPrice),
    message,
    beforeDiscount: cartPrice,
  };
}

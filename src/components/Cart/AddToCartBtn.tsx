"use client";
import { FaCartShopping } from "react-icons/fa6";
import { useCartQuantityFlow } from "./CartQuantityFlow";
import { getStickerPriceBySize } from "@/lib/stickerPricing.js";

type CartProduct = Record<string, unknown> & {
  size?: string;
  stickerSize?: string;
  quantity?: number;
};

export default function AddToCartBtn({
  product,
  handleAddToCart,
}: {
  product: CartProduct;
  handleAddToCart: (product: CartProduct) => void;
}) {
  const { openQuantityPicker } = useCartQuantityFlow();
  const unitPrice = getStickerPriceBySize(product?.size || product?.stickerSize);

  return (
    <button
      type="button"
      onClick={() =>
        openQuantityPicker({
          unitPrice,
          onConfirm: (quantity) =>
            handleAddToCart({
              ...product,
              quantity,
              price: quantity * unitPrice,
            }),
        })
      }
        className="mb-3 lg:mb-0 px-4 py-2 rounded-3xl bg-indigo-600 hover:bg-[#f87ff0b6] duration-300 text-white w-full lg:w-max font-bold flex flex-row items-center justify-center"
    >
      <FaCartShopping className="mr-2 h-6 w-6" />
      Dodaj do koszyka ({product?.quantity})
    </button>
  );
}

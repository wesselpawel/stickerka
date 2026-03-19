"use client";
import AddToCartBtn from "@/components/Cart/AddToCartBtn";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { getPrice, getStickerPriceNotification } from "@/lib/getStickerPrice";
import { STICKER_UNIT_PRICE_PLN } from "@/lib/stickerPricing.js";
import { setCart } from "@/redux/slices/shopSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function ProductInteractions({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [paperType, setPaperType] = useState("normal");
  const dispatch = useDispatch();
  const handleAddToCart = (payload: any) => {
    dispatch(setCart(payload));
  };
  const { notification } = getStickerPriceNotification(quantity);
  const lineTotal = getPrice(quantity).sumAfterDiscount;

  return (
    <div>
      <p className="mt-2 text-lg font-semibold text-chill-ink">
        Cena:{" "}
        <span className="font-display text-2xl text-chill-ink">
          {STICKER_UNIT_PRICE_PLN} zł
        </span>{" "}
        <span className="text-base font-normal text-zinc-600">/ sztuka</span>
      </p>
      <div>
        <div className="mt-6 text-xl font-bold text-zinc-800 drop-shadow-xl xl:text-2xl">
          Rodzaj papieru
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPaperType("normal")}
            className={`rounded-3xl border border-chill-line bg-chill-mist px-4 py-2 font-bold text-chill-ink duration-300 hover:bg-chill-sage/30 ${
              paperType === "normal" ? "ring-2 ring-chill-sage-dark" : "opacity-80"
            }`}
          >
            Zwykły
          </button>
          <button
            type="button"
            onClick={() => setPaperType("silver")}
            className={`rounded-3xl border border-chill-line bg-gradient-to-br from-slate-500 via-slate-400 to-slate-500 py-2 font-bold text-white duration-300 ${
              paperType === "silver" ? "ring-2 ring-white" : "opacity-80 hover:opacity-100"
            }`}
          >
            Srebrny
          </button>
          <button
            type="button"
            onClick={() => setPaperType("gold")}
            className={`rounded-3xl border border-chill-line bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500 py-2 font-bold text-white duration-300 ${
              paperType === "gold" ? "ring-2 ring-white" : "opacity-80 hover:opacity-100"
            }`}
          >
            Złoty
          </button>
        </div>
      </div>
      <div className="mt-6 text-xl font-bold text-zinc-800 drop-shadow-xl xl:text-2xl">
        Wybierz ilość
      </div>
      <div className="mt-3 flex flex-col md:flex-row">
        <div className="flex flex-col items-center lg:flex-row">
          <div className="relative h-max w-full md:mr-3 lg:w-[150px]">
            <button
              type="button"
              onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
              className="absolute left-0 flex h-full items-center justify-center rounded-l-3xl bg-chill-sage-dark pl-4 pr-3 text-xl font-bold text-white duration-300 hover:bg-chill-sage"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => {
                setQuantity(quantity + 1);
              }}
              className="absolute right-0 flex h-full items-center justify-center rounded-r-3xl bg-chill-sage-dark pr-4 pl-3 text-xl font-bold text-white duration-300 hover:bg-chill-sage"
            >
              +
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isNaN(v) && v >= 1) setQuantity(v);
              }}
              className="w-full rounded-3xl border border-chill-line bg-chill-mist py-2 px-4 text-center font-bold text-chill-ink placeholder:text-zinc-400"
              placeholder="Ilość"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse items-center md:mt-0 lg:flex-row">
          <AddToCartBtn
            product={{
              ...product,
              paperType,
              quantity,
              price: lineTotal,
            }}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>
      <div className="my-3 text-3xl font-bold text-chill-ink">
        {getPolishCurrency(lineTotal)}
      </div>
      {notification ? (
        <div className="mb-6 mt-1 text-sm font-semibold text-zinc-600 sm:text-base">
          {notification}
        </div>
      ) : null}
    </div>
  );
}

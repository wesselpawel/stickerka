import { createSlice } from "@reduxjs/toolkit";
import { cartItemTotalPln, DEFAULT_STICKER_SIZE } from "@/lib/stickerPricing.js";

/** Unique key per cart line (custom uploads never merge across different files). */
function cartLineKey(item) {
  if (item.isCollectionBundle) return `collection:${item.collectionId}`;
  if (item.customStickerId) return `c:${item.customStickerId}`;
  const size = item?.size || item?.stickerSize || DEFAULT_STICKER_SIZE;
  if (item.collectionId && item.collectionItemId) {
    return `collection:${item.collectionId}:${item.collectionItemId}|${size}`;
  }
  return `p:${item.title}|${item.paperType || "normal"}|${size}`;
}

const initialState = {
  cart: [],
  promotion: -1,
  couponId: null,
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
    setCart: (state, action) => {
      const p = action.payload;
      const key = cartLineKey(p);
      const idx = state.cart.findIndex((item) => cartLineKey(item) === key);
      if (idx >= 0) {
        const q = Number(state.cart[idx].quantity) + Number(p.quantity);
        state.cart[idx].quantity = q;
        state.cart[idx].size = state.cart[idx].size || p.size || DEFAULT_STICKER_SIZE;
        state.cart[idx].price = cartItemTotalPln(state.cart[idx]);
      } else {
        const size = p.size || p.stickerSize || DEFAULT_STICKER_SIZE;
        const item = {
          ...p,
          size,
          quantity: Number(p.quantity),
        };
        item.price = cartItemTotalPln(item);
        state.cart.push(item);
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    setPromotion: (state, action) => {
      state.promotion = action.payload.promotion;
      state.couponId = action.payload.couponId;
    },
    prepareCart: (state) => {
      const raw = localStorage.getItem("cart");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          state.cart = Array.isArray(parsed)
            ? parsed.map((item) => {
                const q = Math.max(1, Math.floor(Number(item.quantity) || 1));
                const size = item?.size || item?.stickerSize || DEFAULT_STICKER_SIZE;
                const restoredItem = { ...item, size, quantity: q };
                return { ...restoredItem, price: cartItemTotalPln(restoredItem) };
              })
            : [];
        } catch {
          state.cart = [];
        }
      } else {
        state.cart = [];
      }
    },
    removeFromCart: (state, action) => {
      state.cart.splice(action.payload, 1);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const { setCart, removeFromCart, prepareCart, clearCart, setPromotion } = shopSlice.actions;

export default shopSlice.reducer;

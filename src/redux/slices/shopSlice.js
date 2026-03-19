import { createSlice } from "@reduxjs/toolkit";
import { lineTotalPln } from "@/lib/stickerPricing.js";

/** Unique key per cart line (custom uploads never merge across different files). */
function cartLineKey(item) {
  if (item.customStickerId) return `c:${item.customStickerId}`;
  return `p:${item.title}|${item.paperType || "normal"}`;
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
        state.cart[idx].price = lineTotalPln(q);
      } else {
        state.cart.push({
          ...p,
          quantity: Number(p.quantity),
          price: lineTotalPln(p.quantity),
        });
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
                return { ...item, quantity: q, price: lineTotalPln(q) };
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

export const { setCart, removeFromCart, prepareCart, clearCart, setPromotion } =
  shopSlice.actions;

export default shopSlice.reducer;

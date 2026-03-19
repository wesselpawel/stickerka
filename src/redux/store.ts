import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import postsReducer from "./slices/posts";
import shopSlice from "./slices/shopSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      posts: postsReducer,
      shop: shopSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch: () => AppDispatch = useDispatch;

// `TypedUseSelectorHook` type issues across versions can break type-checking.
// Keep the hook typed in a version-agnostic way.
export const useAppSelector: <TSelected>(
  selector: (state: RootState) => TSelected
) => TSelected = useSelector;
export const useAppStore: () => AppStore = useStore;

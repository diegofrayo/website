import { createSlice } from "@reduxjs/toolkit";

import { T_Locale, T_Store } from "~/types";

const REDUCER_NAME = "page-config";

const slice = createSlice({
  name: REDUCER_NAME,
  initialState: {
    locales: undefined,
  },
  reducers: {
    setLocales: (state, action) => {
      state.locales = action.payload;
    },
  },
});

export default slice.reducer;

export { REDUCER_NAME };

export const { setLocales } = slice.actions;

// --- Selectors ---

export function selectPageConfig(store: T_Store): T_Locale[] {
  return store[REDUCER_NAME];
}

// @ts-nocheck

import { createSlice } from "@reduxjs/toolkit";

import { T_Locale } from "~/features/i18n";

import { T_Store } from "../types";

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

// --- SELECTORS ---

export function selectPageConfig(store: T_Store): T_Locale[] {
	return store[REDUCER_NAME];
}

// --- TYPES ---

export type T_PageConfig = {
	locales: T_Locale[];
	reloadWhenLocaleChanges: boolean;
};

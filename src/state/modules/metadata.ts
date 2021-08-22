import { createSlice } from "@reduxjs/toolkit";

import { T_SEOMetadata, T_Store, T_WebsiteMetadata } from "~/types";

const REDUCER_NAME = "metadata";

const slice = createSlice({
  name: REDUCER_NAME,
  initialState: {},
  reducers: {},
});

export default slice.reducer;

export { REDUCER_NAME };

// --- Selectors ---

export function selectWebsiteMetadata(store: T_Store): T_WebsiteMetadata {
  return store[REDUCER_NAME].website;
}

export function selectSEOMetadata(store: T_Store): T_SEOMetadata {
  return store[REDUCER_NAME].seo;
}

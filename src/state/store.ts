import { configureStore } from "@reduxjs/toolkit";

import { T_MetadataReducer, T_PageContent, T_Store } from "~/types";
import {
  isDevelopmentEnvironment,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/misc";

import metadataReducer, { REDUCER_NAME as METADATA_REDUCER_NAME } from "./modules/metadata";
import uiReducer, { REDUCER_NAME as UI_REDUCER_NAME } from "./modules/ui";
let store;

type T_PreloadedState = Partial<T_Store>;

export default function initializeStore(preloadedState: T_PreloadedState): T_Store {
  let _store = store ?? createStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = createStore({
      ...store.getState(),
      ...preloadedState,
    });

    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;

  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

export function createPreloadedState({
  metadata,
  pageContent,
}: {
  metadata: T_MetadataReducer;
  pageContent: T_PageContent;
}): T_PreloadedState {
  return {
    [METADATA_REDUCER_NAME]: metadata,
    [UI_REDUCER_NAME]: transformObjectKeysFromSnakeCaseToLowerCamelCase(pageContent?.page?.config),
  };
}

// --- Utils ---

function createStore(preloadedState: T_PreloadedState) {
  return configureStore({
    reducer: {
      [METADATA_REDUCER_NAME]: metadataReducer,
      [UI_REDUCER_NAME]: uiReducer,
    },
    devTools: isDevelopmentEnvironment(),
    preloadedState,
  });
}

import { configureStore } from "@reduxjs/toolkit";

import { I18nService, T_Locale, T_PageContent } from "~/i18n";
import { isDevelopmentEnvironment } from "~/utils/app";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";

import metadataReducer, {
  REDUCER_NAME as METADATA_REDUCER_NAME,
  T_Metadata,
} from "./modules/metadata";
import pageConfigReducer, { REDUCER_NAME as PAGE_CONFIG_REDUCER_NAME } from "./modules/page-config";
import { T_Store } from "./types";

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
  locale,
}: {
  metadata: T_Metadata;
  pageContent: T_PageContent;
  locale?: T_Locale;
}): T_PreloadedState {
  const pageConfig =
    (transformObjectKeysFromSnakeCaseToLowerCamelCase(pageContent?.page?.config) as T_Object) || {};

  if (!pageConfig.locales) {
    pageConfig.locales = [locale || I18nService.getCurrentLocale()];
  }

  return {
    [METADATA_REDUCER_NAME]: metadata,
    [PAGE_CONFIG_REDUCER_NAME]: pageConfig,
  };
}

// --- Utils ---

function createStore(preloadedState: T_PreloadedState) {
  return configureStore({
    reducer: {
      [METADATA_REDUCER_NAME]: metadataReducer,
      [PAGE_CONFIG_REDUCER_NAME]: pageConfigReducer,
    },
    devTools: isDevelopmentEnvironment(),
    preloadedState,
  });
}

import { configureStore } from "@reduxjs/toolkit";

import { I18nService } from "~/i18n";
import type { T_Locale, T_PageContent } from "~/types";
import { isDevelopmentEnvironment } from "~/utils/app";
import { transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/objects-and-arrays";
import { isObject, isUndefined } from "~/utils/validations";

import metadataReducer, { REDUCER_NAME as METADATA_REDUCER_NAME } from "./modules/metadata";
import pageConfigReducer, { REDUCER_NAME as PAGE_CONFIG_REDUCER_NAME } from "./modules/page-config";
import type { T_Metadata, T_Store } from "./types";

type T_PreloadedState = Partial<T_Store>;

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

let store = createStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default function initializeStore(preloadedState: T_PreloadedState): T_Store {
  let initiliatizedStore = store ?? createStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    initiliatizedStore = createStore({
      ...store.getState(),
      ...preloadedState,
    });

    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") {
    return initiliatizedStore;
  }

  // Create the store once in the client
  if (!initiliatizedStore) {
    store = initiliatizedStore;
  }

  return initiliatizedStore;
}

type T_CreatePreloadedStateParams = {
  metadata: T_Metadata;
  pageContent: T_PageContent;
  locale?: T_Locale;
};

export function createPreloadedState({
  metadata,
  pageContent,
  locale,
}: T_CreatePreloadedStateParams): T_PreloadedState {
  const pageConfig = isObject(pageContent?.page?.config)
    ? transformObjectKeysFromSnakeCaseToLowerCamelCase(pageContent?.page?.config)
    : {};

  if (isUndefined(pageConfig.locales)) {
    pageConfig.locales = [locale || I18nService.getCurrentLocale()];
  }

  return {
    [METADATA_REDUCER_NAME]: metadata,
    [PAGE_CONFIG_REDUCER_NAME]: pageConfig,
  };
}

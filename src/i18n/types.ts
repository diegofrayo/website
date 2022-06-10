import type { T_UnknownObject } from "~/types";

export type T_TranslationFunction = (key: string) => string;

export type T_PageContent = {
  seo?: T_UnknownObject;
  page?: T_UnknownObject & {
    common?: T_UnknownObject;
    config?: T_UnknownObject;
  };
  layout?: {
    header?: T_UnknownObject;
    footer?: T_UnknownObject;
  };
};

export type T_Locale = "en";

import type { T_ObjectWithPrimitives, T_UnknownObject } from "~/types";

export type T_Locale = "en";

export type T_PageContent = {
  seo?: T_ObjectWithPrimitives;
  page?: T_UnknownObject & {
    common?: T_ObjectWithPrimitives;
    config?: T_UnknownObject;
  };
  layout?: {
    header?: T_ObjectWithPrimitives;
    footer?: T_ObjectWithPrimitives;
  };
};

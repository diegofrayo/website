import { useTranslation as useTranslationLibrary } from "react-i18next";

import { T_Locale } from "~/types";

type T_UseTraslationProps = {
  page?: boolean;
  seo?: boolean;
  layout?: boolean;
};

function useTranslation({ page = false, seo = false, layout = false }: T_UseTraslationProps): {
  t: any;
  currentLocale: T_Locale;
} {
  const { t, i18n } = useTranslationLibrary(
    [page && "page", layout && "layout", seo && "seo"].filter(Boolean) as string[],
  );

  return { t, currentLocale: i18n.language as T_Locale };
}

export default useTranslation;

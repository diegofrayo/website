import { useRouter } from "next/router";

import { T_GetSiteTextsParam, T_Locale, T_SiteTexts } from "~/types";
import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

type T_UseInternationalization = {
  SiteTexts: T_SiteTexts;
  currentLocale: T_Locale;
};

function useInternationalization(config: T_GetSiteTextsParam): T_UseInternationalization {
  const { locale } = useRouter();
  setCurrentLocale(locale as T_Locale);

  return { SiteTexts: getSiteTexts(config), currentLocale: locale as T_Locale };
}

export default useInternationalization;

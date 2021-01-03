import { useRouter } from "next/router";

import { TypeLocale, TypeSiteTexts } from "~/types";
import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

type TypeUseInternationalizationReturn = {
  SiteTexts: TypeSiteTexts;
  currentLocale: TypeLocale;
};

function useInternationalization(config): TypeUseInternationalizationReturn {
  const { locale } = useRouter();
  setCurrentLocale(locale as TypeLocale);

  return { SiteTexts: getSiteTexts(config), currentLocale: locale as TypeLocale };
}

export default useInternationalization;

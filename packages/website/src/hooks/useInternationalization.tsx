import { useRouter } from "next/router";

import { TypeGetSiteTextsParam, TypeLocale, TypeSiteTexts } from "~/types";
import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

type TypeUseInternationalization = {
  SiteTexts: TypeSiteTexts;
  currentLocale: TypeLocale;
};

function useInternationalization(config: TypeGetSiteTextsParam): TypeUseInternationalization {
  const { locale } = useRouter();
  setCurrentLocale(locale as TypeLocale);

  return { SiteTexts: getSiteTexts(config), currentLocale: locale as TypeLocale };
}

export default useInternationalization;

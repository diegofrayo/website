import { useRouter } from "next/router";

import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

function useInternationalization(config) {
  const { locale } = useRouter();
  setCurrentLocale(locale);

  return { SiteTexts: getSiteTexts(config), currentLocale: locale };
}

export default useInternationalization;

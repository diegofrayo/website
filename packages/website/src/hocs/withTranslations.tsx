import React from "react";
import { useRouter } from "next/router";

import { TypeGetSiteTextsParam, TypeLocale } from "~/types";
import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function withTranslations(Component: any, config: TypeGetSiteTextsParam): any {
  return function withTranslationsHOC(props: Record<string, any>): any {
    const { locale } = useRouter();
    setCurrentLocale(locale as TypeLocale);

    return (
      <Component
        SiteTexts={getSiteTexts({ ...config, locale: locale as TypeLocale })}
        {...props}
      />
    );
  };
}

export default withTranslations;

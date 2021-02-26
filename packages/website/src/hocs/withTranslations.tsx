import React from "react";
import { useRouter } from "next/router";
import hoistNonReactStatics from "hoist-non-react-statics";

import { TypeGetSiteTextsParam, TypeLocale } from "~/types";
import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function withTranslations(Component: any, config: TypeGetSiteTextsParam): any {
  const WithTranslationsHOC = (props: Record<string, any>): any => {
    const { locale } = useRouter();
    setCurrentLocale(locale as TypeLocale);

    return (
      <Component SiteTexts={getSiteTexts({ ...config, locale: locale as TypeLocale })} {...props} />
    );
  };

  WithTranslationsHOC.displayName = `withTranslations(${Component.displayName || Component.name})`;

  return hoistNonReactStatics(WithTranslationsHOC, Component);
}

export default withTranslations;

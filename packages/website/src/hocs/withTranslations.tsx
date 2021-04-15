import React from "react";
import { useRouter } from "next/router";
import hoistNonReactStatics from "hoist-non-react-statics";

import {
  T_GetSiteTextsParam,
  T_Locale,
  T_Object,
  T_ReactElement,
  T_ReactFunctionComponent,
  T_SiteTexts,
} from "~/types";
import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

function withTranslations(
  Component: T_ReactFunctionComponent<{ SiteTexts: T_SiteTexts }>,
  config: T_GetSiteTextsParam,
): T_ReactFunctionComponent {
  const WithTranslationsHOC = (props: T_Object): T_ReactElement => {
    const { locale } = useRouter();
    setCurrentLocale(locale as T_Locale);

    return (
      <Component SiteTexts={getSiteTexts({ ...config, locale: locale as T_Locale })} {...props} />
    );
  };

  WithTranslationsHOC.displayName = `withTranslations(${Component.displayName || Component.name})`;

  return hoistNonReactStatics(WithTranslationsHOC, Component);
}

export default withTranslations;

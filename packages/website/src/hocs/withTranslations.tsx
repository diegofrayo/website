import React from "react";
import { useRouter } from "next/router";

import { getSiteTexts, setCurrentLocale } from "~/utils/internationalization";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function withTranslations(Component: any, config: Record<string, any>): any {
  return function withTranslationsHOC(props: Record<string, any>): any {
    const { locale } = useRouter();
    setCurrentLocale(locale);

    return <Component SiteTexts={getSiteTexts({ ...config, locale })} {...props} />;
  };
}

export default withTranslations;

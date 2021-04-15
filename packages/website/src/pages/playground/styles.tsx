import React from "react";
import classNames from "classnames";
import { useTheme } from "next-themes";

import { Page, MainLayout } from "~/components/layout";
import { safeRender } from "~/hocs";
import { T_ReactElement, T_SiteTexts } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";

const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "styles";

function StylesPage(): T_ReactElement {
  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: ROUTES.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <Content />
      </MainLayout>
    </Page>
  );
}

export default StylesPage;

// --- Components ---

const Content = safeRender(function Content() {
  const { theme } = useTheme();

  const STYLES = {
    bg: ["dfr-bg-primary", "dfr-bg-secondary"],
    text: ["dfr-text-color-primary", "dfr-text-color-secondary", "dfr-text-color-links"],
    border: ["dfr-border-color-primary"],
  };

  return (
    <div>
      {Object.entries(STYLES).map(([property, classes]) => {
        if (property === "bg") {
          return <Section key="Section-bg" title="bg" classes={classes} theme={theme} />;
        }

        if (property === "text") {
          return <Section key="Section-text" title="text" classes={classes} theme={theme} />;
        }

        if (property === "border") {
          return <Section key="Section-border" title="border" classes={classes} theme={theme} />;
        }

        return null;
      })}
    </div>
  );
});

function Section({ title, classes, theme }) {
  return (
    <section className="tw-mb-8 tw-text-sm tw-text-right">
      <h2 className="tw-text-xl tw-mb-3">{title}</h2>
      <div className="tw-flex tw-flex-wrap tw-justify-end">
        {classes.map((className, index) => {
          const classNameWithTheme = `${theme === "dark" ? "dark:" : ""}${className}`;

          return (
            <div
              key={`Section-${title}-${index}`}
              className="tw-w-full sm:tw-w-auto sm:tw-ml-4 tw-mb-4"
              role="button"
              data-clipboard-text={classNameWithTheme}
              onClick={copyToClipboard}
            >
              <div
                className={classNames(
                  "tw-border tw-p-2 tw-text-left",
                  className,
                  `dark:${className}`,
                )}
              >
                i&apos;m a box with {title}
              </div>
              <code className="tw-font-bold">{classNameWithTheme}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}

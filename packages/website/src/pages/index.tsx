import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, Emoji, Link } from "~/components";
import Routes from "~/data/routes.json";
import { withTranslations } from "~/hocs";
import { TypePagesRoutes, TypeSiteTexts } from "~/types";
import { generateSupportedLocales } from "~/utils/internationalization";
import { isUserLoggedIn } from "~/utils/misc";

type TypeHomePageProps = {
  SiteTexts: TypeSiteTexts;
};

function HomePage({ SiteTexts }: TypeHomePageProps): any {
  return (
    <Page
      config={{
        description: SiteTexts.page.current_locale.meta_description,
        pathname: Routes.HOME,
      }}
    >
      <MainLayout
        locales={generateSupportedLocales(SiteTexts.page.config.locales, Routes.HOME)}
        title={SiteTexts.page.current_locale.title}
      >
        <MainMenu SiteTexts={SiteTexts} />
      </MainLayout>
    </Page>
  );
}

export default withTranslations(HomePage, { page: Routes.HOME as TypePagesRoutes });

// --- Components ---

function MainMenu({ SiteTexts }) {
  const ITEMS = [
    {
      emoji: "✍️",
      label: SiteTexts.page.common.menu_item_blog,
      url: Routes.BLOG,
    },
    {
      emoji: "🙋‍♂️",
      label: SiteTexts.page.current_locale.menu_item_about_me,
      url: Routes.ABOUT_ME,
    },
    {
      emoji: "📄",
      label: SiteTexts.page.current_locale.menu_item_resume,
      url: Routes.RESUME,
    },
    {
      emoji: "🛠️",
      label: SiteTexts.page.common.menu_item_snippets,
      url: Routes.SNIPPETS,
    },
    {
      emoji: "🔮",
      label: SiteTexts.page.current_locale.menu_item_playground,
      url: Routes.PLAYGROUND,
    },
  ].concat(
    isUserLoggedIn()
      ? [
          {
            emoji: "🚀",
            label: SiteTexts.page.common.menu_item_roadmap,
            url: Routes.ROADMAP,
          },
        ]
      : [],
  );

  return (
    <nav className="tw-mt-8 tw-flex tw-flex-wrap tw-justify-center">
      {ITEMS.map((item, index) => {
        return (
          <section
            key={`MainMenuItem-${index}`}
            className="tw-relative twc-border-color-primary tw-border tw-inline-block tw-mb-4 tw-mx-2 tw-cursor-pointer tw-rounded-md"
          >
            <Link
              is={NextLink}
              href={item.url}
              className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-py-2 tw-font-bold tw-h-full tw-relative hover:tw-top-1px hover:tw-left-1px"
              styled={false}
            >
              <Emoji>{item.emoji}</Emoji>
              <span className="tw-text-center">{item.label}</span>
            </Link>
            <Emoji className="twc-bg-secondary twc-border-color-primary dark:twc-bg-secondary tw-border tw-absolute tw--top-2 tw--left-2 tw-rounded-full tw-p-1 tw-text-sm tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center">
              📎
            </Emoji>

            <style jsx>{`
              section {
                height: 100px;
                width: 150px;
              }
            `}</style>
          </section>
        );
      })}
    </nav>
  );
}

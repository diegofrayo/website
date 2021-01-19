import React from "react";
import NextLink from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { Link } from "~/components/primitive";
import { Emoji } from "~/components/shared";
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
    {
      emoji: "🎸",
      label: SiteTexts.page.current_locale.menu_item_music,
      url: Routes.MUSIC,
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
    <div className="tw-mt-8 tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
      {ITEMS.map((item, index) => {
        return (
          <div
            key={`MainMenu-item-${index}`}
            className="tw-relative dfr-border-color-primary tw-border-l tw-border-b tw-inline-block tw-mb-8 sm:tw-mb-6 tw-cursor-pointer tw-rounded-md"
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
            <Emoji className="dfr-bg-secondary dfr-border-color-primary tw-border tw-absolute tw--top-2 tw--left-2 tw-rounded-full tw-p-1 tw-text-sm tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-transform tw--rotate-90">
              📌
            </Emoji>

            <style jsx>{`
              div {
                height: 100px;
                max-width: 100%;
                width: 300px;

                @screen sm {
                  width: 47%;
                }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}

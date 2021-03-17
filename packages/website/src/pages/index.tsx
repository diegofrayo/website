import React from "react";
import NextLink from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { Link, UL } from "~/components/primitive";
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
      <MainLayout locales={generateSupportedLocales(SiteTexts.page.config.locales, Routes.HOME)}>
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
    <UL>
      {ITEMS.map((item, index) => {
        return (
          <li key={`MainMenu-item-${index}`}>
            <Link
              is={NextLink}
              href={item.url}
              className="tw-inline-block tw-text-black dark:tw-text-white"
              styled={false}
            >
              <Emoji>{item.emoji}</Emoji>
              <span className="tw-ml-2">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </UL>
  );
}

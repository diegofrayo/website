import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { withTranslations } from "~/hocs";
import { TypeSiteTexts } from "~/types";
import { generateSupportedLocales } from "~/utils/internationalization";
import { Routes } from "~/utils/routing";

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

export default withTranslations(HomePage, { page: Routes.HOME });

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
  ];

  return (
    <List>
      {ITEMS.map((item, index) => {
        return (
          <Link
            key={`MainMenu-item-${index}`}
            href={item.url}
            className="tw-block sm:tw-inline-block"
            variant={Link.variant.UNSTYLED}
            isNextLink
          >
            <Emoji>{item.emoji}</Emoji>
            <span className="tw-ml-2">{item.label}</span>
          </Link>
        );
      })}
    </List>
  );
}

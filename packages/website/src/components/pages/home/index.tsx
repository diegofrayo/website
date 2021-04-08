import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { withTranslations } from "~/hocs";
import { TypePagesRoutes, TypeReactChildren, TypeSiteTexts } from "~/types";
import { generateSupportedLocales } from "~/utils/internationalization";
import { Routes } from "~/utils/routing";

function HomePage({ SiteTexts }: { SiteTexts: TypeSiteTexts }): TypeReactChildren {
  return (
    <Page
      config={{
        description: SiteTexts.page.current_locale.meta_description,
        pathname: Routes.HOME,
      }}
    >
      <MainLayout locales={generateSupportedLocales(SiteTexts.page.config.locales, Routes.HOME)}>
        <Content SiteTexts={SiteTexts} />
      </MainLayout>
    </Page>
  );
}

export default withTranslations(HomePage, { page: Routes.HOME });

// --- Components ---

function Content({ SiteTexts }) {
  const ITEMS: { emoji: string; label: string; url: TypePagesRoutes }[] = [
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
      emoji: "🎸",
      label: SiteTexts.page.current_locale.menu_item_music,
      url: Routes.MUSIC,
    },
    {
      emoji: "🔮",
      label: SiteTexts.page.current_locale.menu_item_playground,
      url: Routes.PLAYGROUND,
    },
  ];

  return (
    <List>
      {ITEMS.map((item, index) => {
        return (
          <Link
            key={`Content-item-${index}`}
            href={item.url}
            variant={Link.variant.UNSTYLED}
            isNextLink
          >
            <Emoji className="tw-mr-2">{item.emoji}</Emoji>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </List>
  );
}

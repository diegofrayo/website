import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { withTranslations } from "~/hocs";
import { T_PagesRoutes, T_ReactElement, T_SiteTexts } from "~/types";
import { generateSupportedLocales } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";

function HomePage({ SiteTexts }: { SiteTexts: T_SiteTexts }): T_ReactElement {
  return (
    <Page
      config={{
        description: SiteTexts.page.current_locale.meta_description,
        pathname: ROUTES.HOME,
      }}
    >
      <MainLayout locales={generateSupportedLocales(SiteTexts.page.config.locales, ROUTES.HOME)}>
        <Content SiteTexts={SiteTexts} />
      </MainLayout>
    </Page>
  );
}

export default withTranslations(HomePage, { page: ROUTES.HOME });

// --- Components ---

function Content({ SiteTexts }: { SiteTexts: T_SiteTexts }): T_ReactElement {
  const ITEMS: { emoji: string; label: string; url: T_PagesRoutes }[] = [
    {
      emoji: "✍️",
      label: SiteTexts.page.common.menu_item_blog,
      url: ROUTES.BLOG,
    },
    {
      emoji: "🙋‍♂️",
      label: SiteTexts.page.current_locale.menu_item_about_me,
      url: ROUTES.ABOUT_ME,
    },
    {
      emoji: "📄",
      label: SiteTexts.page.current_locale.menu_item_resume,
      url: ROUTES.RESUME,
    },
    {
      emoji: "🛠️",
      label: SiteTexts.page.common.menu_item_snippets,
      url: ROUTES.SNIPPETS,
    },
    {
      emoji: "🎸",
      label: SiteTexts.page.current_locale.menu_item_music,
      url: ROUTES.MUSIC,
    },
    {
      emoji: "🔮",
      label: SiteTexts.page.current_locale.menu_item_playground,
      url: ROUTES.PLAYGROUND,
    },
  ];

  return (
    <List>
      {ITEMS.map((item, index) => {
        return (
          <List.Item key={`Content-item-${index}`}>
            <Link href={item.url} variant={Link.variant.UNSTYLED} isNextLink>
              <Emoji className="tw-mr-2">{item.emoji}</Emoji>
              <span>{item.label}</span>
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}

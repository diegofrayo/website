import React, { useState } from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { withTranslations } from "~/hocs";
import { useDidMount } from "~/hooks";
import { T_PagesRoutes, T_ReactElement, T_SiteTexts } from "~/types";
import { generateSupportedLocales } from "~/utils/internationalization";
import { isUserLoggedIn } from "~/utils/misc";
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
  const [items, setItems] = useState<
    {
      emoji: string | T_ReactElement;
      label: string;
      url: T_PagesRoutes | string;
      isNextLink: boolean;
    }[]
  >([]);

  useDidMount(() => {
    const newItems = [
      {
        emoji: "✍️",
        label: SiteTexts.page.common.menu_item_blog,
        url: ROUTES.BLOG,
        isNextLink: true,
      },
      {
        emoji: "📄",
        label: SiteTexts.page.current_locale.menu_item_resume,
        url: ROUTES.RESUME,
        isNextLink: true,
      },
    ];

    setItems(
      newItems.concat(
        isUserLoggedIn()
          ? [
              {
                emoji: "🙋‍♂️",
                label: SiteTexts.page.current_locale.menu_item_about_me,
                url: ROUTES.ABOUT_ME,
                isNextLink: true,
              },
              {
                emoji: "🛠️",
                label: SiteTexts.page.common.menu_item_snippets,
                url: ROUTES.SNIPPETS,
                isNextLink: true,
              },
              {
                emoji: "🎸",
                label: SiteTexts.page.current_locale.menu_item_music,
                url: ROUTES.MUSIC,
                isNextLink: true,
              },
              {
                emoji: "🔮",
                label: SiteTexts.page.current_locale.menu_item_playground,
                url: ROUTES.PLAYGROUND,
                isNextLink: true,
              },
            ]
          : [],
      ),
    );
  });

  return (
    <List variant={List.variant.UNSTYLED}>
      {items.map((item, index) => {
        return (
          <List.Item key={`Content-item-${index}`}>
            <Link href={item.url} variant={Link.variant.SIMPLE} isNextLink={item.isNextLink}>
              <Emoji className="tw-w-6 tw-inline-block tw-mr-1">{item.emoji}</Emoji>
              <span
                className={classNames(
                  !item.isNextLink &&
                    "tw-border-b tw-border-dashed tw-font-bold tw-border-black dark:tw-border-white",
                )}
              >
                {item.label}
              </span>
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}

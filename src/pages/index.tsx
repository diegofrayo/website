import React, { useState } from "react";

import { Page, HomeLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useDidMount } from "~/hooks";
import { useTranslation, getPageContentStaticProps } from "~/i18n";
import { T_Locale, T_PageRoute, T_ReactElement } from "~/types";
import { isUserLoggedIn } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";

function HomePage(): T_ReactElement {
  const { t } = useTranslation();

  const [items, setItems] = useState<
    {
      emoji: any;
      label: any;
      url: T_PageRoute;
      locale?: T_Locale;
    }[]
  >([
    {
      emoji: t("page:common:menu_item_about_me_emoji"),
      label: t("page:menu_item_about_me"),
      url: ROUTES.ABOUT_ME,
      locale: undefined,
    },
    {
      emoji: t("page:common:menu_item_resume_emoji"),
      label: t("page:menu_item_resume"),
      url: ROUTES.RESUME,
      locale: undefined,
    },
    {
      emoji: t("page:common:menu_item_blog_emoji"),
      label: t("page:common:menu_item_blog"),
      url: ROUTES.BLOG,
      locale: undefined,
    },
    {
      emoji: t("page:common:menu_item_contact_emoji"),
      label: t("page:menu_item_contact"),
      url: ROUTES.CONTACT,
      locale: undefined,
    },
    {
      emoji: t("page:common:menu_item_music_emoji"),
      label: t("page:menu_item_music"),
      url: ROUTES.MUSIC,
      locale: undefined,
    },
  ]);

  useDidMount(() => {
    if (isUserLoggedIn()) {
      setItems([
        ...items,
        {
          emoji: t("page:common:menu_item_playground_emoji"),
          label: t("page:menu_item_playground"),
          url: ROUTES.PLAYGROUND,
          locale: "es",
        },
      ]);
    }
  });

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.HOME,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <HomeLayout>
        <List variant={List.variant.UNSTYLED}>
          {items.map((item, index) => {
            return (
              <List.Item key={`HomePage-List.Item-${index}`}>
                <Link
                  href={item.url}
                  variant={Link.variant.SIMPLE}
                  className="tw-flex tw-justify-center tw-items-center tw-bg-blue-100 dark:tw-bg-gray-700 tw-p-3 tw-border-blue-700 dark:tw-border-gray-500 tw-border-b-4 tw-text-right"
                  locale={item.locale}
                  isNextLink
                >
                  <Emoji className="tw-w-6 tw-inline-block tw-mr-1">{item.emoji}</Emoji>
                  <strong className="tw-flex-1 tw-text-center">{item.label}</strong>
                  <Emoji className="tw-w-6 tw-inline-block tw-ml-1">{item.emoji}</Emoji>
                </Link>
              </List.Item>
            );
          })}
        </List>
      </HomeLayout>
    </Page>
  );
}

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.HOME,
});

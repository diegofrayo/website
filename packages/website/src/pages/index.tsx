import React from "react";
import classNames from "classnames";

import { Page, HomeLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useTranslation } from "~/hooks";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";
import { getPageContentStaticProps } from "~/server/i18n";

function HomePage(): T_ReactElement {
  const { t } = useTranslation({
    page: true,
    seo: true,
  });

  const ITEMS = [
    {
      emoji: t("page:common:menu_item_about_me_emoji"),
      label: t("page:menu_item_about_me"),
      url: ROUTES.ABOUT_ME,
    },
    {
      emoji: t("page:common:menu_item_resume_emoji"),
      label: t("page:menu_item_resume"),
      url: ROUTES.RESUME,
    },
    {
      emoji: t("page:common:menu_item_blog_emoji"),
      label: t("page:common:menu_item_blog"),
      url: ROUTES.BLOG,
    },
    {
      emoji: t("page:common:menu_item_contact_emoji"),
      label: t("page:menu_item_contact"),
      url: ROUTES.CONTACT,
    },
    {
      emoji: t("page:common:menu_item_music_emoji"),
      label: t("page:menu_item_music"),
      url: ROUTES.MUSIC,
    },
    {
      emoji: t("page:common:menu_item_playground_emoji"),
      label: t("page:menu_item_playground"),
      url: ROUTES.PLAYGROUND,
    },
  ];

  return (
    <Page
      config={{
        title: "",
        description: t("seo:description"),
        pathname: ROUTES.HOME,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <HomeLayout>
        <List variant={List.variant.UNSTYLED}>
          {ITEMS.map((item, index) => {
            return (
              <List.Item key={`Content-item-${index}`}>
                <Link
                  href={item.url}
                  variant={Link.variant.SIMPLE}
                  className={classNames(
                    "tw-flex tw-justify-center tw-items-center tw-bg-blue-100 dark:tw-bg-gray-700 tw-p-3 tw-border-blue-700 dark:tw-border-gray-500 tw-border-b-4 tw-text-right",
                    index % 2 === 0
                      ? "tw-rounded-tl-md tw-rounded-br-md"
                      : "tw-rounded-bl-md tw-rounded-tr-md",
                  )}
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

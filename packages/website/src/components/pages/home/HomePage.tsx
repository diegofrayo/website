import React, { useState } from "react";
import classNames from "classnames";

import { Page, HomeLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { withTranslations } from "~/hocs";
import { T_ReactElement, T_SiteTexts } from "~/types";
import { ROUTES } from "~/utils/routing";
import { useDidMount } from "~/hooks";
import { isUserLoggedIn } from "~/utils/misc";

function HomePage({ SiteTexts }: { SiteTexts: T_SiteTexts }): T_ReactElement {
  return (
    <Page
      config={{
        description: SiteTexts.page.current_locale.meta_description,
        pathname: ROUTES.HOME,
      }}
    >
      <HomeLayout>
        <Content SiteTexts={SiteTexts} />
      </HomeLayout>
    </Page>
  );
}

export default withTranslations(HomePage, { page: ROUTES.HOME });

// --- Components ---

function Content({ SiteTexts }: { SiteTexts: T_SiteTexts }): T_ReactElement {
  const [items, setItems] = useState([
    {
      emoji: "🙋‍♂️",
      label: SiteTexts.page.current_locale.menu_item_about_me,
      url: ROUTES.ABOUT_ME,
    },
    {
      emoji: "📝",
      label: SiteTexts.page.current_locale.menu_item_resume,
      url: ROUTES.RESUME,
    },
    {
      emoji: "✍️",
      label: SiteTexts.page.common.menu_item_blog,
      url: ROUTES.BLOG,
    },
    {
      emoji: "💬",
      label: "Contacto",
      url: ROUTES.CONTACT,
    },
    {
      emoji: "🎸",
      label: SiteTexts.page.current_locale.menu_item_music,
      url: ROUTES.MUSIC,
    },
  ]);

  useDidMount(() => {
    if (isUserLoggedIn()) {
      setItems([
        ...items,
        {
          emoji: "🔮",
          label: SiteTexts.page.current_locale.menu_item_playground,
          url: ROUTES.PLAYGROUND,
        },
      ]);
    }
  });

  return (
    <List variant={List.variant.UNSTYLED}>
      {items.map((item, index) => {
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
  );
}

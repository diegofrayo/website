import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List, Space } from "~/components/primitive";
import { withTranslations } from "~/hocs";
import { T_ReactElement, T_SiteTexts } from "~/types";
import { isUserLoggedIn } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";
import { generateSlug, removeEmojiFromString } from "~/utils/strings";

type T_PlaygroundPageProps = {
  SiteTexts: T_SiteTexts;
};

function PlaygroundPage({ SiteTexts }: T_PlaygroundPageProps): T_ReactElement {
  return (
    <Page config={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <PagesList
          pages={["🎼 chords-creator", "📝 strings", "💅 styles", "👓 virtual-reality", "💬 wp"]}
        />

        {isUserLoggedIn() && (
          <div className="tw-font-bold">
            <Space sizeTop={6} sizeBottom={4} variant={Space.variant.DASHED} />
            <PagesList pages={["🎀 maria", "❤️ baria", "📖 books", "🎬 movies", "🤨 stupid"]} />
          </div>
        )}
      </MainLayout>
    </Page>
  );
}

export default withTranslations(PlaygroundPage, {
  page: ROUTES.PLAYGROUND,
  layout: true,
});

// --- Components ---

function PagesList({ pages }) {
  return (
    <List>
      {pages.map((name) => {
        return (
          <List.Item key={`PlaygroundPage-name-${name}`}>
            <Link
              href={`${ROUTES.PLAYGROUND}/${generateSlug(removeEmojiFromString(name))}`}
              variant={Link.variant.SIMPLE}
              isNextLink
            >
              {name}
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}

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
          pages={[
            { name: "🎼 chords-creator", isNextLink: true },
            { name: "📝 strings", isNextLink: true },
            {
              name: "👓 virtual-reality",
              url: "/static/pages/playground/virtual-reality/index.html",
              isNextLink: false,
            },
            { name: "💬 whatsapp", isNextLink: true },
          ]}
        />

        {isUserLoggedIn() && (
          <div className="tw-font-bold">
            <Space sizeTop={6} sizeBottom={4} variant={Space.variant.DASHED} />
            <PagesList
              pages={[
                { name: "📚 books", isNextLink: true },
                { name: "🎥 movies", isNextLink: true },
                { name: "🔨 encrypt-lab", isNextLink: true },
                { name: "💅 styles", isNextLink: true },
              ]}
            />
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
    <List variant={List.variant.UNSTYLED}>
      {pages.map((page) => {
        return (
          <List.Item key={`PlaygroundPage-name-${page.name}`}>
            <Link
              href={
                page.url || `${ROUTES.PLAYGROUND}/${generateSlug(removeEmojiFromString(page.name))}`
              }
              variant={Link.variant.SIMPLE}
              isNextLink={page.isNextLink}
            >
              {page.name}
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}

import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List, Space } from "~/components/primitive";
import { getPageContentStaticProps } from "~/i18n";
import { T_ReactElement, T_PageContent } from "~/types";
import { isUserLoggedIn } from "~/utils/misc";
import { ROUTES } from "~/utils/routing";
import { generateSlug, removeEmojiFromString } from "~/utils/strings";

type T_PageProps = {
  pageContent: T_PageContent;
};

function PlaygroundPage({ pageContent }: T_PageProps): T_ReactElement {
  return (
    <Page
      config={{
        title: pageContent.page?.title,
        disableSEO: pageContent.page?.config?.is_seo_disabled,
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: pageContent.layout?.breadcumb?.home as string,
            url: ROUTES.HOME,
          },
          {
            text: pageContent.layout?.breadcumb?.playground as string,
          },
        ]}
        title={pageContent.page?.title as string}
      >
        <PagesList
          pages={[
            { name: "🎼 chords-creator", isNextLink: true },
            { name: "📝 strings", isNextLink: true },
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

export default PlaygroundPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.PLAYGROUND,
});

// --- Components ---

function PagesList({ pages }: { pages: { name: string; isNextLink: boolean }[] }): T_ReactElement {
  return (
    <List variant={List.variant.UNSTYLED}>
      {pages.map((page) => {
        return (
          <List.Item key={`PagesList-page-${page.name}`}>
            <Link
              href={`${ROUTES.PLAYGROUND}/${generateSlug(removeEmojiFromString(page.name))}`}
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

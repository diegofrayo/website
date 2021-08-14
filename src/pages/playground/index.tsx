import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { getPageContentStaticProps } from "~/i18n";
import { T_ReactElement, T_PageContent } from "~/types";
import { PLAYGROUND_PAGES } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

type T_PageProps = {
  pageContent: T_PageContent;
};

function PlaygroundPage({ pageContent }: T_PageProps): T_ReactElement {
  const PAGE_TITLE = "🔮 playground";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
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
        title={PAGE_TITLE}
      >
        <PagesList pages={PLAYGROUND_PAGES} />
      </MainLayout>
    </Page>
  );
}

export default PlaygroundPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps();

// --- Components ---

function PagesList({ pages }: { pages: { slug: string; title: string }[] }): T_ReactElement {
  return (
    <List variant={List.variant.UNSTYLED}>
      {pages.map((page) => {
        return (
          <List.Item key={page.slug}>
            <Link
              href={`${ROUTES.PLAYGROUND}/${page.slug}`}
              variant={Link.variant.SIMPLE}
              isNextLink
            >
              {page.title}
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}

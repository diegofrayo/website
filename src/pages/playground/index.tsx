import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, List } from "~/components/primitive";
import { withAuth } from "~/auth";
import { getPageContentStaticProps } from "~/i18n";
import { T_ReactElement } from "~/types";
import { PLAYGROUND_PAGES } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

function PlaygroundPage(): T_ReactElement {
  const PAGE_TITLE = "playground";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        <PagesList pages={PLAYGROUND_PAGES} />
      </MainLayout>
    </Page>
  );
}

export default withAuth(PlaygroundPage);

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({ locale: "es" });

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

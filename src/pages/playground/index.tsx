import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block } from "~/components/primitive";
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
    <Block className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
      {pages.map((page) => {
        return (
          <Link
            key={page.slug}
            href={`${ROUTES.PLAYGROUND}/${page.slug}`}
            variant={Link.variant.SIMPLE}
            className="dfr-border-primary tw-flex tw-items-center tw-justify-center tw-text-center tw-border tw-border-dashed tw-w-48 tw-h-48 tw-font-bold tw-mx-0.5 tw-my-2 tw-p-2"
            isNextLink
          >
            {page.title}
          </Link>
        );
      })}
    </Block>
  );
}

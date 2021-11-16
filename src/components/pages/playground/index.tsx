import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Space } from "~/components/primitive";
import { withAuth } from "~/auth";
import type { T_ReactElement } from "~/types";
import { PLAYGROUND_PAGES } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

function PlaygroundPage(): T_ReactElement {
  const PAGE_TITLE = "Playground";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        <PagesList pages={PLAYGROUND_PAGES.slice(0, 4)} />
        <Space size={4} variant={Space.variant.DASHED} />
        <PagesList pages={PLAYGROUND_PAGES.slice(4)} />
      </MainLayout>
    </Page>
  );
}

export default withAuth(PlaygroundPage);

// --- Components ---

function PagesList({ pages }: { pages: { slug: string; title: string }[] }): T_ReactElement {
  return (
    <Block className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
      {pages.map((page) => {
        return (
          <Link
            key={page.slug}
            variant={Link.variant.SECONDARY}
            href={`${ROUTES.PLAYGROUND}/${page.slug}`}
            className="dfr-border-color-primary tw-flex tw-items-center tw-justify-center tw-text-center tw-border tw-border-dotted tw-w-48 tw-h-48 tw-mx-0.5 tw-my-2 tw-p-2"
          >
            {page.title}
          </Link>
        );
      })}
    </Block>
  );
}

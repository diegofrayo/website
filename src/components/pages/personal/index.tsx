import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Icon, InlineText, Space, List } from "~/components/primitive";
import { withAuth } from "~/auth";
import type { T_ReactElement } from "~/types";
import { PERSONAL_PAGES } from "~/utils/constants";
import { ROUTES } from "~/utils/routing";

function PersonalPage(): T_ReactElement {
  const PAGE_TITLE = "Personal";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        <Block className="tw-w-full sm:tw-max-w-md sm:tw-mx-auto">
          <PagesList pages={PERSONAL_PAGES.slice(0, 4)} />
          <Space size={4} variant={Space.variant.DASHED} />
          <PagesList pages={PERSONAL_PAGES.slice(4)} />
          <Space size={4} variant={Space.variant.DASHED} />
          <Link
            variant={Link.variant.SECONDARY}
            href={ROUTES.BOOKMARKS}
            className="dfr-border-color-primary tw-flex tw-items-center tw-justify-between tw-border tw-border-dotted tw-h-20 tw-my-2 tw-p-2"
          >
            <Icon icon={Icon.icon.COG} size={32} />
            <InlineText className="tw-mx-2 tw-flex-1 tw-text-center tw-truncate">
              bookmarks
            </InlineText>
            <Icon icon={Icon.icon.COG} size={32} />
          </Link>
        </Block>
      </MainLayout>
    </Page>
  );
}

export default withAuth(PersonalPage);

// --- Components ---

function PagesList({
  pages,
}: {
  pages: { slug: string; title: string; icon: string }[];
}): T_ReactElement {
  return (
    <List variant={List.variant.UNSTYLED}>
      {pages.map((page) => {
        return (
          <List.Item key={page.slug}>
            <Link
              variant={Link.variant.SECONDARY}
              href={`${ROUTES.PERSONAL}/${page.slug}`}
              className="dfr-border-color-primary tw-flex tw-items-center tw-justify-between tw-border tw-border-dotted tw-h-20 tw-my-2 tw-p-2"
            >
              <Icon icon={Icon.icon[page.icon]} size={32} />
              <InlineText className="tw-mx-2 tw-flex-1 tw-text-center tw-truncate">
                {page.title}
              </InlineText>
              <Icon icon={Icon.icon[page.icon]} size={32} />
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}

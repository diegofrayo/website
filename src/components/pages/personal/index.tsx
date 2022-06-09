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
        <Block className="tw-w-full sm:tw-mx-auto sm:tw-max-w-md">
          <PagesList pages={PERSONAL_PAGES.slice(0, 5)} />
          <Space
            size={4}
            variant={Space.variant.DASHED}
          />
          <PagesList pages={PERSONAL_PAGES.slice(5)} />
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
      {pages.map((page) => (
        <List.Item key={page.slug}>
          <Link
            variant={Link.variant.SECONDARY}
            href={`${ROUTES.PERSONAL}/${page.slug}`}
            className="tw-my-2 tw-flex tw-h-20 tw-items-center tw-justify-between tw-border tw-border-dotted tw-p-2 dfr-border-color-primary"
          >
            <Icon
              icon={Icon.icon[page.icon]}
              size={32}
            />
            <InlineText className="tw-mx-2 tw-flex-1 tw-truncate tw-text-center">
              {page.title}
            </InlineText>
            <Icon
              icon={Icon.icon[page.icon]}
              size={32}
            />
          </Link>
        </List.Item>
      ))}
    </List>
  );
}

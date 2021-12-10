import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Icon, InlineText } from "~/components/primitive";
import { withAuth } from "~/auth";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function ProjectsPage(): T_ReactElement {
  const PAGE_TITLE = "Projects";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        <Block className="tw-w-full sm:tw-max-w-md sm:tw-mx-auto">
          <Link
            variant={Link.variant.SECONDARY}
            href={ROUTES.MUSIC}
            className="dfr-border-color-primary tw-flex tw-items-center tw-justify-between tw-border tw-border-dotted tw-h-20 tw-my-2 tw-p-2"
          >
            <Icon icon={Icon.icon.MUSIC_NOTE} size={32} />
            <InlineText className="tw-mx-2 tw-flex-1 tw-text-center tw-truncate">music</InlineText>
            <Icon icon={Icon.icon.MUSIC_NOTE} size={32} />
          </Link>
          <Link
            variant={Link.variant.SECONDARY}
            href={ROUTES.TIMER}
            className="dfr-border-color-primary tw-flex tw-items-center tw-justify-between tw-border tw-border-dotted tw-h-20 tw-my-2 tw-p-2"
          >
            <Icon icon={Icon.icon.COG} size={32} />
            <InlineText className="tw-mx-2 tw-flex-1 tw-text-center tw-truncate">timer</InlineText>
            <Icon icon={Icon.icon.COG} size={32} />
          </Link>
        </Block>
      </MainLayout>
    </Page>
  );
}

export default withAuth(ProjectsPage);

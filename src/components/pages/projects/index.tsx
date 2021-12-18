import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, Icon, Text, Space } from "~/components/primitive";
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
        <Block className="tw-flex tw-justify-between tw-flex-wrap sm:tw-max-w-md sm:tw-mx-auto">
          <Link
            variant={Link.variant.SECONDARY}
            href={ROUTES.MUSIC}
            className="dfr-border-color-primary tw-flex tw-items-center tw-justify-center tw-flex-col tw-border tw-border-dotted tw-my-2 tw-px-8 tw-py-16 tw-w-full sm:tw-w-auto sm:tw-flex-1"
          >
            <Icon icon={Icon.icon.MUSIC_NOTE} size={64} />
            <Text className="tw-text-center tw-truncate tw-mt-2">music</Text>
          </Link>
          <Space size={1} orientation="v" className="tw-hidden sm:tw-block" />
          <Link
            variant={Link.variant.SECONDARY}
            href={ROUTES.TIMER}
            className="dfr-border-color-primary tw-flex tw-items-center tw-justify-center tw-flex-col tw-border tw-border-dotted tw-my-2 tw-px-8 tw-py-16 tw-w-full sm:tw-w-auto sm:tw-flex-1"
          >
            <Icon icon={Icon.icon.CLOCK} size={64} />
            <Text className="tw-text-center tw-truncate tw-mt-2">timer</Text>
          </Link>
        </Block>
      </MainLayout>
    </Page>
  );
}

export default withAuth(ProjectsPage);

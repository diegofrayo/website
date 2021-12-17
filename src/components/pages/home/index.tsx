import * as React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Page, MainLayout } from "~/components/layout";
import { Block } from "~/components/primitive";
import { MDXContent } from "~/components/shared";
import { useTranslation } from "~/i18n";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function Home({ mdxContent }: { mdxContent: MDXRemoteSerializeResult }): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.HOME,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout title="👋">
        <Block className="dfr-bg-color-primary dfr-border-color-primary dfr-shadow tw-border-8 tw-px-4 tw-py-8 tw-text-center sm:tw-px-8 sm:tw-py-16 dark:dfr-border-color-primary dark:dfr-shadow dark:dfr-bg-color-primary">
          <MDXContent content={mdxContent} />
        </Block>
      </MainLayout>
    </Page>
  );
}

export default Home;

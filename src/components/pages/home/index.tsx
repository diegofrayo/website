import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Block, InlineText, Space } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function Home(): T_ReactElement {
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
      <MainLayout title="👋 I'm Diego Rayo">
        <Block className="tw-text-center">
          <Item label="about-me" url={ROUTES.ABOUT_ME} />
          <Space size={2} />
          <Item label="resume" url={ROUTES.RESUME} />
          <Space size={2} />
          <Item label="blog" url={ROUTES.BLOG} />
        </Block>
      </MainLayout>
    </Page>
  );
}

export default Home;

// --- Components ---

function Item({ label, url }) {
  return (
    <Block className="tw-text-xl dfr-text-color-dark-strong">
      <InlineText>❴</InlineText>
      <Link variant={Link.variant.SECONDARY} className="tw-mx-2 tw-underline" href={url}>
        {label}
      </Link>
      <InlineText>❵</InlineText>
    </Block>
  );
}

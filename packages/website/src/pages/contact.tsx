import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Link, Space } from "~/components/primitive";
import { useTranslation } from "~/hooks";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";
import { WEBSITE_METADATA } from "~/utils/constants";
import { getPageContentStaticProps } from "~/server/i18n";

function ContactPage(): T_ReactElement {
  const { t } = useTranslation({ seo: true, layout: true, page: true });

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.CONTACT,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: t("layout:breadcumb:home"),
            url: ROUTES.HOME,
          },
          {
            text: t("layout:breadcumb:contact"),
          },
        ]}
        title={t("seo:title")}
      >
        <div className="tw-mb-20">
          <Item
            href={WEBSITE_METADATA.social.github}
            icon={<Icon icon={Icon.icon.GITHUB} size={32} withDarkModeBackground />}
            text="/diegofrayo"
          />
          <Space size={2} />
          <Item
            href={`mailto:${WEBSITE_METADATA.email}`}
            icon={<Icon icon={Icon.icon.GMAIL} size={32} />}
            text={t("page:send_me_message")}
          />
        </div>
      </MainLayout>
    </Page>
  );
}

export default ContactPage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.CONTACT,
});

// --- Components ---

type T_ItemProps = {
  href: string;
  icon: T_ReactElement;
  text: string;
};

function Item({ href, icon, text }: T_ItemProps): T_ReactElement {
  return (
    <Link href={href} variant={Link.variant.SIMPLE} className="tw-block">
      <div className="tw-flex tw-items-center">
        {icon}
        <span className="tw-ml-3 tw-font-bold">{text}</span>
      </div>
    </Link>
  );
}

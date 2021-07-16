import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Link, Space } from "~/components/primitive";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";
import { WEBSITE_METADATA } from "~/utils/constants";

function ContactPage(): T_ReactElement {
  return (
    <Page
      config={{
        description: "Contáctame a través de mi correo electrónico o sigueme en GitHub",
        pathname: ROUTES.CONTACT,
      }}
    >
      <MainLayout
        breadcumb={[
          {
            text: "Inicio",
            url: ROUTES.HOME,
          },
          {
            text: "Contacto",
          },
        ]}
        title="💬 Contacto"
      >
        <Content />
      </MainLayout>
    </Page>
  );
}

export default ContactPage;

// --- Components ---

function Content(): T_ReactElement {
  return (
    <div className="tw-mb-20">
      <Link
        href={WEBSITE_METADATA.social.github}
        isNextLink={false}
        variant={Link.variant.SIMPLE}
        className="tw-block"
      >
        <div className="tw-flex tw-items-center">
          <Icon icon={Icon.icon.GITHUB} size={32} withDarkModeBackground />
          <span className="tw-ml-3 tw-font-bold">/diegofrayo</span>
        </div>
      </Link>
      <Space size={2} />
      <Link
        href={`mailto:${WEBSITE_METADATA.email}`}
        isNextLink={false}
        variant={Link.variant.SIMPLE}
        className="tw-block"
      >
        <div className="tw-flex tw-items-center">
          <Icon icon={Icon.icon.GMAIL} size={32} />
          <span className="tw-ml-3 tw-font-bold">envíame un mensaje</span>
        </div>
      </Link>
    </div>
  );
}

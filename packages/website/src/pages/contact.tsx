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
        description: "Contáctame a través de mi correo electrónico o sígueme en GitHub",
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
            text="envíame un mensaje"
          />
        </div>
      </MainLayout>
    </Page>
  );
}

export default ContactPage;

// --- Components ---

function Item({ href, icon, text }): T_ReactElement {
  return (
    <Link href={href} variant={Link.variant.SIMPLE} className="tw-block">
      <div className="tw-flex tw-items-center">
        {icon}
        <span className="tw-ml-3 tw-font-bold">{text}</span>
      </div>
    </Link>
  );
}

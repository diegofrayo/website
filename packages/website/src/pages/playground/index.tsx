import * as React from "react";
import NextLink from "next/link";

import { MainLayout, Page, UL, Link } from "~/components";
import { Routes } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";

const SiteTexts = getSiteTexts({ page: Routes.PLAYGROUND(), layout: true });

function PlaygroundPage(): any {
  return (
    <Page metadata={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND(),
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <UL>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND("stupid")}>
              <a>stupid</a>
            </Link>
          </li>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND("text")}>
              <a>text</a>
            </Link>
          </li>
          <li>
            <Link is={NextLink} href={Routes.PLAYGROUND("virtual-reality")}>
              <a>virtual-reality</a>
            </Link>
          </li>
        </UL>
      </MainLayout>
    </Page>
  );
}

export default PlaygroundPage;

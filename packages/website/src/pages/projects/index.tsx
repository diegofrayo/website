import * as React from "react";
import NextLink from "next/link";

import { MainLayout, Page, UL, Link } from "~/components";
import { Routes } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";

const SiteTexts = getSiteTexts({ page: Routes.PROJECTS(), layout: true });

function ProjectsPage(): any {
  return (
    <Page metadata={{ noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.projects,
            url: Routes.PROJECTS(),
          },
        ]}
        title={SiteTexts.page.current_locale.title}
      >
        <UL>
          <li>
            <Link is={NextLink} href="/projects/stupid">
              <a>stupid</a>
            </Link>
          </li>
          <li>
            <Link is={NextLink} href="/projects/text">
              <a>text</a>
            </Link>
          </li>
        </UL>
      </MainLayout>
    </Page>
  );
}

export default ProjectsPage;

import * as React from "react";
import NextLink from "next/link";

import { MainLayout, Page, UL, Link } from "~/components";
import { getSiteTexts } from "~/i18n";
import { Routes } from "~/utils/constants";

const SiteTexts = getSiteTexts({ layout: true });

function ProjectsPage(): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.breadcumb.projects, url: Routes.PROJECTS() },
        ]}
        title={SiteTexts.layout.breadcumb.projects}
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

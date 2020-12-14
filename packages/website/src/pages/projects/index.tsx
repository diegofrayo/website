import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, UL, Link } from "~/components";

function ProjectsPage(): any {
  return (
    <Page>
      <MainLayout>
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

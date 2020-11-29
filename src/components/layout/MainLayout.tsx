import React, { Fragment } from "react";

import twcss from "~/lib/twcss";

export default function MainLayout({ children }: Record<string, unknown>): any {
  return (
    <Fragment>
      <Main>
        <Body>{children}</Body>
      </Main>
      <section id="modals-portal-container" />
    </Fragment>
  );
}

// --- Components ---

const Main = twcss.main``;

const Body = twcss.section``;

import React from "react";

import { MainLayout, Page, Separator } from "~/components";
import Routes from "~/data/routes.json";
import Chords from "~/lib/chords";
import { TypeSiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts: TypeSiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "chords";

function ChordsPage(): any {
  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
            url: Routes.PLAYGROUND_PROJECTS[PAGE_NAME],
          },
        ]}
        title={PAGE_NAME}
      >
        <Chords
          name="MI Mayor (M)"
          chords={[
            { finger: 3, fret: 2, string: 5 },
            { finger: 2, fret: 2, string: 4 },
            { finger: 1, fret: 1, string: 3 },
          ]}
        />
        <Separator size={8} />
        <Chords
          name="DO Mayor (C)"
          chords={[
            { finger: 3, fret: 3, string: 5 },
            { finger: 2, fret: 2, string: 4 },
            { finger: 1, fret: 1, string: 2 },
          ]}
        />
        <Separator size={8} />
        <Chords
          name="LA Mayor (A)"
          chords={[
            { finger: 1, fret: 2, string: 4 },
            { finger: 2, fret: 2, string: 3 },
            { finger: 3, fret: 2, string: 2 },
          ]}
        />
        <Separator size={8} />
      </MainLayout>
    </Page>
  );
}

export default ChordsPage;

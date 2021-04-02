import React, { useState } from "react";

import { Page, MainLayout } from "~/components/layout";
import { Separator } from "~/components/primitive";
import Routes from "~/data/routes.json";
import { Chords } from "~/lib/chords";
import { TypePagesRoutes, TypeSiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts: TypeSiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "chords";

function ChordsPage(): any {
  const [inputs, setInputs] = useState({ name: "", chords: "" });

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND as TypePagesRoutes,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <div>
          <h2 className="tw-text-2xl tw-mb-4">Create your chord</h2>

          <label htmlFor="input-name">
            <strong className="tw-block tw-cursor-pointer">Name</strong>
            <input
              id="input-name"
              placeholder="Example: A"
              className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              value={inputs.name}
              maxLength={15}
              onChange={e => {
                setInputs({ ...inputs, name: e.currentTarget.value });
              }}
            />
          </label>
          <Separator size={4} />

          <label htmlFor="input-chords">
            <strong className="tw-block tw-cursor-pointer">Chords</strong>
            <input
              id="input-chords"
              placeholder="4,2,1|3,2,2|2,2,3"
              className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              value={inputs.chords}
              onChange={e => {
                setInputs({ ...inputs, chords: e.currentTarget.value });
              }}
            />
          </label>
          <code className="tw-block tw-text-sm tw-mt-2 tw-mb-1">
            Format: STRING,FRET,FINGER?|STRING,FRET,FINGER?
          </code>
          <code className="tw-block tw-text-sm">
            Examples: (D) 3,2,1|1,2,2|2,3,3 / (B) 5x,2|4,4|3,4|2,4
          </code>
          <Separator size={6} />

          <div className="tw-border tw-p-4">
            <strong>output</strong>
            <Chords name={inputs.name} chords={inputs.chords} />
          </div>
        </div>
        <Separator size={8} className="tw-border-b" />

        <div>
          <h2 className="tw-text-2xl tw-mb-4">Examples</h2>

          <Chords
            name="MI Mayor (E)"
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
            stringsToSkip={[6]}
          />
          <Separator size={8} />
          <Chords name="LA Mayor (A)" chords="4,2,1|3,2,2|2,2,3" stringsToSkip={[6]} />
          <Separator size={8} />
          <Chords name="RE Mayor (D)" chords="3,2,1|1,2,2|2,3,3" stringsToSkip="6,5" />
          <Separator size={8} />
          <Chords
            name="SI Mayor (B)"
            chords={[
              { finger: 1, fret: 2, barre: { until: 5 } },
              { finger: 4, fret: 4, string: 4 },
              { finger: 3, fret: 4, string: 3 },
              { finger: 2, fret: 4, string: 2 },
            ]}
          />
        </div>
      </MainLayout>
    </Page>
  );
}

export default ChordsPage;

import React, { useState } from "react";

import { MainLayout, Page, Separator } from "~/components";
import Routes from "~/data/routes.json";
import Chords from "~/lib/chords";
import { TypeSiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts: TypeSiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "chords";

function ChordsPage(): any {
  const [inputs, setInputs] = useState({ name: "", chords: "" });

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
        <section>
          <h2 className="tw-text-2xl tw-mb-4">Create your chord</h2>

          <label htmlFor="input-name">
            <strong className="tw-cursor-pointer">Chord name</strong>
            <input
              className="tw-border tw-border-b-4 twc-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              value={inputs.name}
              id="input-name"
              onChange={e => {
                setInputs({ ...inputs, name: e.currentTarget.value });
              }}
            />
          </label>
          <Separator size={4} />

          <label htmlFor="input-chords">
            <strong className="tw-cursor-pointer">Chords</strong>
            <input
              id="input-chords"
              className="tw-border tw-border-b-4 twc-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              value={inputs.chords}
              onChange={e => {
                setInputs({ ...inputs, chords: e.currentTarget.value });
              }}
            />
            <code className="tw-block">
              Format: STRING,FRET,FINGER|STRING,FRET,FINGER
            </code>
            <code className="tw-block">Example: &ldquo;3,2,1|1,2,2|2,3,3&ldquo;</code>
          </label>
          <Separator size={6} />

          <section className="tw-border tw-p-2">
            <strong>output</strong>
            <Chords name={inputs.name} chords={inputs.chords} />
          </section>
        </section>
        <Separator size={8} className="tw-border-b" />

        <section>
          <h2 className="tw-text-2xl tw-mb-4">Examples</h2>

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
            skip={[6]}
          />
          <Separator size={8} />
          <Chords name="LA Mayor (A)" chords="4,2,1|3,2,2|2,2,3" skip={[6]} />
          <Separator size={8} />
          <Chords name="RE Mayor (D)" chords="3,2,1|1,2,2|2,3,3" skip="6,5" />
          <Separator size={8} />
          <Chords
            name="SI Mayor (B)"
            chords={[
              { finger: 1, fret: 2, barre: { until: 5 } },
              { finger: 2, fret: 4, string: 2 },
              { finger: 3, fret: 4, string: 3 },
              { finger: 4, fret: 4, string: 4 },
            ]}
          />
        </section>
      </MainLayout>
    </Page>
  );
}

export default ChordsPage;

import React, { useState } from "react";

import { Page, MainLayout } from "~/components/layout";
import { Space, Title } from "~/components/primitive";
import { Chords } from "~/lib/chords";
import { T_ReactElement, T_SiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";

const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "chords";

function ChordsPage(): T_ReactElement {
  const [inputs, setInputs] = useState({ name: "", chords: "" });

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: ROUTES.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <div>
          <Title is="h2" className="tw-mb-4">
            Create your chord
          </Title>

          <label htmlFor="input-name">
            <strong className="tw-block tw-cursor-pointer">Name</strong>
            <input
              id="input-name"
              placeholder="Example: A"
              className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              value={inputs.name}
              maxLength={15}
              onChange={(e) => {
                setInputs({ ...inputs, name: e.currentTarget.value });
              }}
            />
          </label>
          <Space size={4} />

          <label htmlFor="input-chords">
            <strong className="tw-block tw-cursor-pointer">Chords</strong>
            <input
              id="input-chords"
              placeholder="4,2,1|3,2,2|2,2,3"
              className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              value={inputs.chords}
              onChange={(e) => {
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
          <Space size={6} />

          <div className="tw-border tw-rounded-md tw-p-3">
            <Title is="h2" className="tw-mb-4">
              Output
            </Title>
            <Chords name={inputs.name} chords={inputs.chords} />
          </div>
        </div>
        <Space size={8} variant={Space.variant.DASHED} />

        <div>
          <Title is="h2" className="tw-mb-4">
            Examples
          </Title>

          <Chords
            name="MI Mayor (E)"
            chords={[
              { finger: 3, fret: 2, string: 5 },
              { finger: 2, fret: 2, string: 4 },
              { finger: 1, fret: 1, string: 3 },
            ]}
          />
          <Space size={8} />

          <Chords
            name="DO Mayor (C)"
            chords={[
              { finger: 3, fret: 3, string: 5 },
              { finger: 2, fret: 2, string: 4 },
              { finger: 1, fret: 1, string: 2 },
            ]}
            stringsToSkip={[6]}
          />
          <Space size={8} />

          <Chords name="LA Mayor (A)" chords="4,2,1|3,2,2|2,2,3" stringsToSkip={[6]} />
          <Space size={8} />

          <Chords name="RE Mayor (D)" chords="3,2,1|1,2,2|2,3,3" stringsToSkip="6,5" />
          <Space size={8} />

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

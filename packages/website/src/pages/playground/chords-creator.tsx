import React, { Fragment, useState } from "react";

import { Space, Title } from "~/components/primitive";
import { PlaygroundPageTemplate } from "~/components/pages/playground";
import { GuitarChord } from "~/lib/guitar";
import { T_ReactElement } from "~/types";

function ChordsPage(): T_ReactElement {
  return (
    <PlaygroundPageTemplate pageName="🎼 chords-creator">
      <Content />
    </PlaygroundPageTemplate>
  );
}

export default ChordsPage;

// --- Components ---

function Content(): T_ReactElement {
  const [inputs, setInputs] = useState({ name: "", musicNotes: "" });

  return (
    <Fragment>
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

        <label htmlFor="input-musicNotes">
          <strong className="tw-block tw-cursor-pointer">Chords</strong>
          <input
            id="input-musicNotes"
            placeholder="4,2,1|3,2,2|2,2,3"
            className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
            value={inputs.musicNotes}
            onChange={(e) => {
              setInputs({ ...inputs, musicNotes: e.currentTarget.value });
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

        <div className="tw-border dfr-border-color-primary dark:dfr-border-color-primary tw-rounded-md tw-p-3">
          <Title is="h2" className="tw-mb-4">
            Output
          </Title>
          <GuitarChord name={inputs.name} musicNotes={inputs.musicNotes} />
        </div>
      </div>
      <Space sizeTop={8} sizeBottom={5} variant={Space.variant.DASHED} />

      <div>
        <Title is="h2" className="tw-mb-4">
          Examples
        </Title>

        <GuitarChord
          name="MI Mayor (E)"
          musicNotes={[
            { finger: 3, guitarFret: 2, guitarString: 5 },
            { finger: 2, guitarFret: 2, guitarString: 4 },
            { finger: 1, guitarFret: 1, guitarString: 3 },
          ]}
        />
        <Space size={8} />

        <GuitarChord
          name="DO Mayor (C)"
          musicNotes={[
            { finger: 3, guitarFret: 3, guitarString: 5 },
            { finger: 2, guitarFret: 2, guitarString: 4 },
            { finger: 1, guitarFret: 1, guitarString: 2 },
          ]}
          playedStrings={["x", "1", "1", "0", "1", "0"]}
        />
        <Space size={8} />

        <GuitarChord
          name="LA Mayor (A)"
          musicNotes="4,2,1|3,2,2|2,2,3"
          playedStrings={["x", "0", "1", "1", "1", "0"]}
        />
        <Space size={8} />

        <GuitarChord
          name="RE Mayor (D)"
          musicNotes="3,2,1|1,2,2|2,3,3"
          playedStrings={["x", "x", "0", "1", "1", "1"]}
        />
        <Space size={8} />

        <GuitarChord
          name="SI Mayor (B)"
          musicNotes={[
            { finger: 1, guitarFret: 2, barre: 5 },
            { finger: 4, guitarFret: 4, guitarString: 4 },
            { finger: 3, guitarFret: 4, guitarString: 3 },
            { finger: 2, guitarFret: 4, guitarString: 2 },
          ]}
        />
      </div>
    </Fragment>
  );
}

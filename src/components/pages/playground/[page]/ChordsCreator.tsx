import React, { Fragment, useState } from "react";

import { Input, Space, Title, Block } from "~/components/primitive";
import { GuitarChord } from "~/lib/guitar";
import { T_ReactElement } from "~/types";

function ChordsCreator(): T_ReactElement {
  const {
    // states
    inputs,

    // handlers
    onInputChange,
  } = useController();

  return (
    <Fragment>
      <Block>
        <Title is="h2" className="tw-mb-4">
          Crea un acorde
        </Title>

        <Input
          id="input-name"
          label="Nombre"
          containerProps={{ className: "tw-my-1" }}
          value={inputs.name}
          maxLength={15}
          onChange={onInputChange("name")}
        />
        <Space size={4} />

        <Input
          id="input-notes"
          label="Notas"
          containerProps={{ className: "tw-my-1" }}
          value={inputs.musicNotes}
          onChange={onInputChange("musicNotes")}
        />
        <Space size={1} />

        <Block>
          <code className="tw-block tw-text-sm tw-mb-1">
            Formato: CUERDA,TRASTE,DEDO?|CUERDA,TRASTE,DEDO?
          </code>
          <code className="tw-block tw-text-sm">
            Ejemplos: (D) 3,2,1|1,2,2|2,3,3 / (B) 5x,2|4,4|3,4|2,4
          </code>
        </Block>
        <Space size={6} />

        <Block className="tw-border dfr-border-primary dark:dfr-border-primary tw-rounded-md tw-p-3">
          <Title is="h2" className="tw-mb-4">
            Resultado
          </Title>
          <GuitarChord name={inputs.name} musicNotes={inputs.musicNotes} />
        </Block>
      </Block>
      <Space sizeTop={8} sizeBottom={5} variant={Space.variant.DASHED} />

      <Block>
        <Title is="h2" className="tw-mb-4">
          Ejemplos
        </Title>

        <GuitarChord
          name="MI Mayor (E)"
          musicNotes={[
            { finger: 3, guitarFret: 2, guitarString: 5 },
            { finger: 2, guitarFret: 2, guitarString: 4 },
            { finger: 1, guitarFret: 1, guitarString: 3 },
          ]}
          playedStrings={["0", "1", "1", "1", "0", "0"]}
          enableShowNotesOption
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
          enableShowNotesOption
        />
        <Space size={8} />

        <GuitarChord
          name="LA Mayor (A)"
          musicNotes="4,2,1|3,2,2|2,2,3"
          playedStrings={["x", "0", "1", "1", "1", "0"]}
          enableShowNotesOption
        />
        <Space size={8} />

        <GuitarChord
          name="RE Mayor (D)"
          musicNotes="3,2,1|1,2,2|2,3,3"
          playedStrings={["x", "x", "0", "1", "1", "1"]}
          enableShowNotesOption
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
          playedStrings={["x", "0", "1", "1", "1", "0"]}
          enableShowNotesOption
        />
      </Block>
    </Fragment>
  );
}

export default ChordsCreator;

// --- Controller ---

function useController(): {
  inputs: { name: string; musicNotes: string };
  onInputChange: any;
} {
  const [inputs, setInputs] = useState({ name: "", musicNotes: "" });

  function onInputChange(inputName) {
    return function onInputChange(e) {
      setInputs({ ...inputs, [inputName]: e.currentTarget.value });
    };
  }

  return {
    // states
    inputs,

    // handlers
    onInputChange,
  };
}

import React, { Fragment, useRef } from "react";
import classnames from "classnames";

import { Emoji } from "~/components";
import { createArray } from "~/utils/misc";

import twcss from "./twcss";

type TypeChord = {
  finger: number;
  string: number;
  fret: number;
};

type TypeChordsProps = {
  name: string;
  chords: Array<TypeChord> | string; // "STRING,FRET,FINGER"
  skip?: Array<number>;
};

function Chords({ name, chords, skip }: TypeChordsProps): any {
  const chordRef: { current: any } = useRef(undefined);

  const { firstFret, lastFret, chordsGroupedByFret } = groupChordsByFret(chords);

  async function handleDownloadAsImage(): Promise<void> {
    const domtoimage = await import("dom-to-image");

    domtoimage.toPng(chordRef.current, { quality: 0.95 }).then(dataUrl => {
      const link = document.createElement("a");
      link.download = `${name}.jpeg`;
      link.href = dataUrl;
      link.click();
    });
  }

  return (
    <article className="tw-max-w-full tw-text-center">
      <section ref={chordRef}>
        <h1 className="tw-text-center tw-font-bold tw-mb-1">{name}</h1>

        <section className="tw-flex tw-flex-no-wrap tw-justify-start sm:tw-justify-center tw-overflow-x-auto">
          <Fret variant="FRET_STRINGS_NAMES" />
          <Fret variant="FRET_EMPTY" fret={lastFret + 1}></Fret>
          {Object.entries(chordsGroupedByFret)
            .reverse()
            .map(([fret, chords]: [string, TypeChord[]]) => {
              return (
                <Fret
                  key={`Fret-${fret}`}
                  variant="FRET_DEFAULT"
                  fret={Number(fret)}
                  chords={chords}
                />
              );
            })}
          {firstFret - 1 > 0 && <Fret variant="FRET_EMPTY" fret={firstFret - 1} />}
          {skip && <Fret variant="FRET_SKIP_STRINGS" skip={skip} />}
        </section>
      </section>

      <button
        className="tw-text-sm tw-font-bold tw-mt-2 tw-p-1"
        onClick={handleDownloadAsImage}
      >
        <Emoji className="tw-mr-1">⬇️</Emoji>
        <span>download as image</span>
      </button>
    </article>
  );
}

// --- Components ---

type TypeFretProps = {
  variant: "FRET_DEFAULT" | "FRET_STRINGS_NAMES" | "FRET_EMPTY" | "FRET_SKIP_STRINGS";
  fret?: undefined | number;
  chords?: undefined | Array<TypeChord>;
  skip?: TypeChordsProps["skip"];
};

function Fret({ variant, fret, chords, skip }: TypeFretProps): any {
  const isEmptyVariant = variant === "FRET_EMPTY";
  const isStringsNamesVariant = variant === "FRET_STRINGS_NAMES";
  const isDefaultVariant = variant === "FRET_DEFAULT";
  const isSkipStringsVariant = variant === "FRET_SKIP_STRINGS";
  const STRINGS_NAMES = [
    "E (mi)",
    "A (la)",
    "D (re)",
    "G (sol)",
    "B (si)",
    "E (mi)",
  ].reverse();

  return (
    <section
      className={classnames(
        "tw-text-center tw-flex-shrink-0 tw-text-sm",
        isStringsNamesVariant || isSkipStringsVariant ? "tw-auto" : "tw-w-16",
      )}
    >
      <section className="tw-flex tw-items-center tw-justify-center tw-h-10 tw-font-bold">
        {fret || ""}
      </section>
      <section
        className={classnames(
          "tw-w-full",
          !isStringsNamesVariant &&
            !isSkipStringsVariant &&
            "tw-border-l-2 tw-border-r-2 tw-border-yellow-400 tw-bg-yellow-700",
        )}
      >
        {createArray(6)
          .reverse()
          .map(string => {
            const chord =
              isDefaultVariant && chords?.find(chord => chord.string === string);

            return (
              <section
                key={`Fret-${
                  isEmptyVariant
                    ? `empty-${string}`
                    : isStringsNamesVariant
                    ? `string-${string}`
                    : chord
                    ? `${chord.string}-${chord.finger}`
                    : `${Date.now()}-${string}`
                }`}
                className="tw-flex tw-items-center tw-w-full tw-h-10"
              >
                {isStringsNamesVariant ? (
                  <section className="tw-flex tw-justify-between tw-px-2 tw-w-full">
                    <span>{STRINGS_NAMES[string - 1]}</span>
                    <strong className="tw-ml-2">{string}</strong>
                  </section>
                ) : isSkipStringsVariant ? (
                  <span className="tw-px-2">
                    {skip?.indexOf(Number(string)) != -1 ? "x" : ""}
                  </span>
                ) : chord ? (
                  <Fragment>
                    <String />
                    <span className="tw-rounded-full tw-h-6 tw-w-6 tw-border tw-font-bold tw-bg-white tw-text-black">
                      {chord.finger}
                    </span>
                    <String />
                  </Fragment>
                ) : (
                  <String />
                )}
              </section>
            );
          })}
      </section>
    </section>
  );
}

const String = twcss.span`tw-border tw-border-black tw-bg-black tw-block tw-h-1 tw-flex-1`;

// --- Utils ---

type TypeGroupChordsByFretParams = TypeChordsProps["chords"];

function groupChordsByFret(chordsParam: TypeGroupChordsByFretParams) {
  const chords =
    typeof chordsParam === "string"
      ? chordsParam.split("|").map(
          (item: string): TypeChord => {
            const [string, fret, finger] = item.split(",");

            return {
              finger: Number(finger),
              string: Number(string),
              fret: Number(fret),
            };
          },
        )
      : chordsParam;

  const chordsGroupedByFret = chords.reduce((result, chord) => {
    if (!result[`${chord.fret}`]) {
      result[`${chord.fret}`] = [];
    }

    result[`${chord.fret}`].push(chord);

    return result;
  }, {});

  const frets = Object.keys(chordsGroupedByFret).map(Number);

  return {
    firstFret: frets.length > 0 ? frets[0] : 0,
    lastFret: frets.length > 0 ? frets[frets.length - 1] : 0,
    chordsGroupedByFret,
  };
}

export default Chords;

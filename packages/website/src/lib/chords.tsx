import React, { Fragment, useRef, useState } from "react";
import classnames from "classnames";

import { Emoji, Separator } from "~/components";
import { createArray } from "~/utils/misc";

import twcss from "./twcss";
import { isArrayNoEmpty, isString } from "~/utils/validations";

type TypeChord = {
  fret: number;
  finger?: number;
  string?: number | string | undefined;
  barre?: { until: number };
};

type TypeChordsProps = {
  name: string;
  chords: Array<TypeChord> | string; // "STRING,FRET,FINGER"
  skip?: Array<number> | string; // "Number,Number"
};

function Chords({ name, chords, skip }: TypeChordsProps): any {
  const chordRef: { current: any } = useRef(undefined);
  const [showInput, setShowInput] = useState(false);

  const { firstFret, lastFret, chordsGroupedByFret, error } = groupChordsByFret(chords);

  async function handleDownloadAsImage(): Promise<void> {
    const domtoimage = await import("dom-to-image");

    domtoimage.toPng(chordRef.current, { quality: 0.95 }).then(dataUrl => {
      const link = document.createElement("a");
      link.download = `${name}.jpeg`;
      link.href = dataUrl;
      link.click();
    });
  }

  if (error) {
    return <strong className="tw-block tw-text-red-700">Chords syntax error</strong>;
  }

  return (
    <article className="tw-max-w-full tw-text-center">
      <section ref={chordRef}>
        <h1 className="tw-text-center tw-font-bold tw-mb-1">{name}</h1>

        <section className="tw-inline-flex tw-flex-no-wrap tw-overflow-x-auto tw-max-w-full">
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

      <section>
        <button
          className="tw-text-sm tw-font-bold tw-mt-2 tw-p-1 tw-transition-opacity hover:tw-opacity-75"
          onClick={handleDownloadAsImage}
        >
          <Emoji className="tw-mr-1">⬇️</Emoji>
          <span>download as image</span>
        </button>
        <Separator size={1} dir="v"></Separator>
        <button
          className="tw-text-sm tw-font-bold tw-mt-2 tw-p-1 tw-transition-opacity hover:tw-opacity-75"
          onClick={() => {
            setShowInput(cs => !cs);
          }}
        >
          <span
            className={classnames(
              "tw-inline-block tw-transition-all tw-transform tw-mr-1",
              showInput && "tw-rotate-90",
            )}
          >
            ‣
          </span>
          <span>{showInput ? "hide" : "show"} input</span>
        </button>
      </section>

      {showInput && (
        <section className="tw-text-sm tw-mt-4">
          <strong>input:</strong>
          <pre className="tw-whitespace-pre-line tw-text-sm tw-break-all">
            {JSON.stringify(chords)}
          </pre>
        </section>
      )}
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
    "E-[mi]",
    "A-[la]",
    "D-[re]",
    "G-[sol]",
    "B-[si]",
    "E-[mi]",
  ].reverse();

  return (
    <section
      className={classnames(
        "tw-text-center tw-flex-shrink-0 tw-text-xs",
        isStringsNamesVariant || isSkipStringsVariant ? "tw-auto" : "tw-w-12",
      )}
    >
      <section className="tw-flex tw-items-center tw-justify-center tw-h-6 tw-font-bold">
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
            const isBarreChord =
              isDefaultVariant &&
              isArrayNoEmpty(chords) &&
              (chords ? chords[0] : {}).barre !== undefined;
            const chord =
              isBarreChord && chords
                ? chords[0]
                : isDefaultVariant
                ? chords?.find(chord => chord.string === string)
                : undefined;

            return (
              <section
                key={`Fret-${
                  isEmptyVariant
                    ? `empty-${string}`
                    : isStringsNamesVariant
                    ? `string-${string}`
                    : isBarreChord
                    ? `barre-${string}`
                    : chord
                    ? `${chord.string}-${chord.finger}`
                    : `${Date.now()}-${string}`
                }`}
                className="tw-flex tw-items-center tw-w-full tw-h-6"
              >
                {isStringsNamesVariant ? (
                  <section className="tw-flex tw-justify-between tw-px-2 tw-w-full">
                    <span>{STRINGS_NAMES[string - 1]}</span>
                    <strong className="tw-ml-2">{string}</strong>
                  </section>
                ) : isSkipStringsVariant ? (
                  <span className="tw-px-2">
                    {(typeof skip === "string"
                      ? skip.split(",").map(Number)
                      : skip
                    )?.indexOf(Number(string)) != -1
                      ? "x"
                      : ""}
                  </span>
                ) : isBarreChord ? (
                  <Fragment>
                    <String />
                    {((chord?.barre?.until as number) >= string ||
                      (chord?.string as string) === "x") && (
                      <span className="tw-h-full tw-border-4" />
                    )}
                    <String />
                  </Fragment>
                ) : chord ? (
                  <Fragment>
                    <String />
                    <span className="tw-rounded-full tw-h-5 tw-w-5 tw-border tw-font-bold tw-bg-white tw-text-black">
                      {chord.finger || ""}
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
  try {
    const chords: TypeChord[] =
      chordsParam === ""
        ? []
        : isString(chordsParam)
        ? (chordsParam as string).split("|").map(
            (item: string): TypeChord => {
              const [string, fret, finger, ...more] = item.split(",");

              if (!item || more.length > 0) throw new Error("Syntax error");

              const chord: TypeChord = {
                finger: Number(finger),
                fret: Number(fret),
              };

              if (string.includes("x")) {
                chord.barre = {
                  until: string.length === 2 ? Number(string[0]) : 6,
                };
              } else {
                chord.string = Number(string);
              }

              return createSafeChord(chord);
            },
          )
        : (chordsParam as TypeChord[]);

    const frets: number[] = chords.map(chord => chord.fret).sort();

    const chordsGroupedByFret =
      chords.length === 0
        ? {}
        : chords.reduce(
            (result, chord) => {
              result[`${chord.fret}`].push(createSafeChord(chord));
              return result;
            },
            createArray(
              Math.max(...frets) - Math.min(...frets) + 1,
              Math.min(...frets),
            ).reduce((result, fret) => {
              result[`${fret}`] = [];
              return result;
            }, {}),
          );

    return {
      error: false,
      firstFret: frets.length > 0 ? frets[0] : 0,
      lastFret: frets.length > 0 ? frets[frets.length - 1] : 0,
      chordsGroupedByFret,
    };
  } catch (e) {
    console.error(e);
    return { firstFret: 0, lastFret: 0, chordsGroupedByFret: {}, error: true };
  }
}

function createSafeChord(chord: TypeChord): TypeChord {
  const possibleStrings = createArray(6);
  const possibleFrets = createArray(16);
  const possibleFingers = createArray(4);
  const safeChord: TypeChord = {
    finger: possibleFingers.indexOf(chord.finger || 0) === -1 ? 0 : chord.finger,
    fret: possibleFrets.indexOf(chord.fret) === -1 ? 1 : chord.fret,
  };

  if (chord.barre) {
    safeChord.barre = {
      until: possibleStrings.indexOf(chord.barre.until) === -1 ? 6 : chord.barre.until,
    };
  } else {
    safeChord.string =
      possibleStrings.indexOf(chord.string as number) === -1 ? 0 : chord.string;
  }

  if (
    Number.isNaN(chord.finger) ||
    Number.isNaN(chord.fret) ||
    Number.isNaN(chord.string)
  ) {
    throw new Error("Syntax error");
  }

  return safeChord;
}

export default Chords;

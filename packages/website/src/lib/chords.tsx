import React, { Fragment, useRef, useState } from "react";
import classnames from "classnames";

import { Emoji, Separator } from "~/components";
import { copyToClipboard } from "~/utils/browser";
import { createArray } from "~/utils/misc";

import twcss from "./twcss";

interface TypeChordBase {
  fret: number;
  finger?: number;
}

interface TypeChordWithString extends TypeChordBase {
  string: number;
}

interface TypeChordWithBarre extends TypeChordBase {
  barre: { until: number };
}

type TypeChord = TypeChordWithString | TypeChordWithBarre;

type TypeChordsProps = {
  name: string;
  chords: Array<TypeChord> | string; // "STRING,FRET,FINGER" | "STRING,FRET"
  stringsToSkip?: Array<number> | string; // "Number,Number"
  showOptions?: boolean;
};

export function Chords({
  name,
  chords,
  stringsToSkip,
  showOptions = true,
}: TypeChordsProps): any {
  const chordRef: { current: any } = useRef(undefined);
  const [showInput, setShowInput] = useState(false);

  const {
    error,
    chordsGroupedByFret,
    chordsToString,
    firstFret,
    lastFret,
  } = groupChordsByFret(chords);

  async function handleDownloadAsImage(): Promise<void> {
    const domtoimage = await import("dom-to-image");

    domtoimage.toPng(chordRef.current, { quality: 1 }).then(dataUrl => {
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = dataUrl;
      link.click();
    });
  }

  function handleShowInput(): void {
    setShowInput(cs => !cs);
  }

  if (error) {
    return (
      <strong className="tw-block tw-text-red-700">
        Chords syntax error: {error.message}
      </strong>
    );
  }

  return (
    <article className="tw-max-w-full tw-text-center">
      <div ref={chordRef}>
        <div className="tw-inline-flex tw-flex-no-wrap tw-overflow-x-auto tw-max-w-full tw-pt-8">
          <Fret variant="FRET_STRINGS_NAMES" />
          <div className="tw-relative tw-inline-flex tw-flex-no-wrap">
            <h1 className="tw-truncate tw-text-xs tw-absolute tw-text-center tw-font-bold tw-w-full tw--top-6">
              {name}
            </h1>

            <Fret variant="FRET_EMPTY" fret={lastFret + 1} />
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
          </div>
          {stringsToSkip && (
            <Fret variant="FRET_SKIP_STRINGS" stringsToSkip={stringsToSkip} />
          )}
        </div>
      </div>

      {showOptions && (
        <Fragment>
          <div className="tw-pt-2">
            <button
              className="tw-text-sm tw-font-bold tw-p-1 tw-transition-opacity hover:tw-opacity-75"
              onClick={handleDownloadAsImage}
            >
              <Emoji className="tw-mr-1">⬇️</Emoji>
              <span>download as image</span>
            </button>
            <Separator size={1} dir="v" />
            {chordsToString && (
              <Fragment>
                <button
                  className="tw-text-sm tw-font-bold tw-py-1 tw-px-2 tw-transition-opacity hover:tw-opacity-75"
                  onClick={handleShowInput}
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
                <Separator size={1} dir="v" />
              </Fragment>
            )}
            <button
              className="tw-text-sm tw-font-bold tw-p-1 tw-transition-opacity hover:tw-opacity-75"
              data-clipboard-text={chordsToString || "Empty chord"}
              onClick={copyToClipboard}
            >
              <Emoji>📋</Emoji> copy input to clipboard
            </button>
          </div>
          {showInput && (
            <div className="tw-text-sm tw-mt-4">
              <strong className="tw-block tw-mb-1">input:</strong>
              <pre className="tw-whitespace-pre-line tw-text-sm tw-break-all">
                {chordsToString}
              </pre>
            </div>
          )}
        </Fragment>
      )}
    </article>
  );
}

export function Solo({ positions, notes }) {
  return (
    <article className="tw-text-sm tw-pr-2">
      <div className="tw-flex">
        <Fret variant="FRET_STRINGS_NAMES" />

        {["|", ...positions.split("|"), "|"].map((item, index) => {
          const [string, fret, finger] = item.split(",");

          return (
            <div key={`Solo-position-${index}`} className="tw-ml-1">
              <div className="tw-h-6" />
              <div>
                {createArray(6)
                  .reverse()
                  .map(i => {
                    if (i === Number(string)) {
                      return (
                        <div key={`Solo-position-${index}-${i}`} className="tw-h-6">
                          {finger !== undefined ? fret : "0"}
                        </div>
                      );
                    }

                    return (
                      <div key={`Solo-position-${index}-${i}`} className="tw-h-6">
                        -
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      <blockquote className="tw-ml-2 tw-whitespace-pre-line tw-break-word">
        {notes}
      </blockquote>
    </article>
  );
}

// --- Components ---

type TypeFretProps = {
  variant: "FRET_DEFAULT" | "FRET_STRINGS_NAMES" | "FRET_EMPTY" | "FRET_SKIP_STRINGS";
  fret?: undefined | number;
  chords?: undefined | Array<TypeChord>;
  stringsToSkip?: TypeChordsProps["stringsToSkip"];
};

function Fret({ variant, fret, chords, stringsToSkip }: TypeFretProps): any {
  const isEmptyVariant = variant === "FRET_EMPTY";
  const isStringsNamesVariant = variant === "FRET_STRINGS_NAMES";
  const isSkipStringsVariant = variant === "FRET_SKIP_STRINGS";
  const isDefaultVariant = variant === "FRET_DEFAULT";
  const STRINGS_NAMES = [
    "E-[mi]",
    "A-[la]",
    "D-[re]",
    "G-[sol]",
    "B-[si]",
    "E-[mi]",
  ].reverse();

  return (
    <div
      className={classnames(
        "tw-flex-shrink-0 tw-text-xs",
        isSkipStringsVariant ? "tw-auto" : isStringsNamesVariant ? "tw-w-16" : "tw-w-10",
      )}
    >
      <div className="tw-flex tw-items-center tw-justify-center tw-h-6 tw-font-bold">
        {fret || ""}
      </div>
      <div
        className={classnames(
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
              Array.isArray(chords) &&
              ((chords.length > 0 ? chords[0] : {}) as TypeChordWithBarre).barre !==
                undefined;
            const chord =
              isBarreChord && chords
                ? chords[0]
                : isDefaultVariant
                ? chords?.find((chord: TypeChordWithString) => chord.string === string)
                : undefined;

            return (
              <div
                key={`Fret-${
                  isEmptyVariant
                    ? `empty-${string}`
                    : isStringsNamesVariant
                    ? `string-${string}`
                    : isBarreChord
                    ? `barre-${string}-${(chord as TypeChordWithBarre).fret}`
                    : chord
                    ? `default-${(chord as TypeChordWithString).string}-${
                        chord.finger || ""
                      }`
                    : `${string}-${Date.now()}`
                }`}
                className="tw-flex tw-items-center tw-h-6"
              >
                {isStringsNamesVariant ? (
                  <div className="tw-flex tw-justify-between tw-w-full tw-px-2">
                    <span>{STRINGS_NAMES[string - 1]}</span>
                    <strong>{string}</strong>
                  </div>
                ) : isSkipStringsVariant ? (
                  <span className="tw-px-2">
                    {(typeof stringsToSkip === "string"
                      ? stringsToSkip.split(",").map(Number)
                      : stringsToSkip
                    )?.indexOf(Number(string)) != -1
                      ? "x"
                      : ""}
                  </span>
                ) : isBarreChord ? (
                  <Fragment>
                    <String />
                    {((chord as TypeChordWithBarre)?.barre?.until as number) >=
                      string && <span className="tw-h-full tw-border-4" />}
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
              </div>
            );
          })}
      </div>
    </div>
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
        : typeof chordsParam === "string"
        ? chordsParam.split("|").map(
            (item: string): TypeChord => {
              const [string, fret, finger, ...more] = item.split(",");

              if (!item || more.length > 0) throw new Error("Syntax error");

              const chord: Partial<TypeChord> = {
                finger: finger === undefined ? undefined : Number(finger),
                fret: Number(fret),
              };

              checkFretValidity(chord.fret || 0);

              if (string.includes("x")) {
                (chord as TypeChordWithBarre).barre = {
                  until: string.length === 2 ? Number(string[0]) : 6,
                };
              } else {
                (chord as TypeChordWithString).string = Number(string);
              }

              return chord as TypeChord;
            },
          )
        : (chordsParam as TypeChord[]);

    const frets: number[] = chords.map(chord => chord.fret).sort();

    const chordsGroupedByFret =
      chords.length === 0
        ? {}
        : chords.reduce(
            (result, chord) => {
              checkFingerValidity(chord.finger);

              if ((chord as TypeChordWithBarre).barre !== undefined) {
                checkBarreValidity((chord as TypeChordWithBarre).barre.until);
              } else {
                checkStringValidity((chord as TypeChordWithString).string);
              }

              result[`${chord.fret}`].push(chord);

              if (
                result[`${chord.fret}`].find(item => item.barre !== undefined) !==
                  undefined &&
                result[`${chord.fret}`].length > 1
              ) {
                throw new Error(
                  "A fret contains a barre chord can't have multiple chords",
                );
              }

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
      error: undefined,
      chordsToString: chordsToString(chordsParam),
      firstFret: frets.length > 0 ? frets[0] : 0,
      lastFret: frets.length > 0 ? frets[frets.length - 1] : 0,
      chordsGroupedByFret,
    };
  } catch (e) {
    console.error(e);

    return {
      chordsToString: "",
      firstFret: 0,
      lastFret: 0,
      chordsGroupedByFret: {},
      error: e,
    };
  }
}

function checkFingerValidity(finger?: number): void {
  if (finger === undefined) return;

  if (Number.isNaN(finger) || finger < 1 || finger > 4) {
    throw new Error("Invalid finger");
  }
}

function checkFretValidity(fret: number): void {
  if (Number.isNaN(fret) || fret < 1 || fret > 20) {
    throw new Error("Invalid fret");
  }
}

function checkStringValidity(string: number): void {
  if (Number.isNaN(string) || string < 1 || string > 6) {
    throw new Error("Invalid string");
  }
}

function checkBarreValidity(until: number): void {
  if (Number.isNaN(until) || until < 3 || until > 6) {
    throw new Error("Invalid barre chord");
  }
}

function chordsToString(chords: TypeChordsProps["chords"]): string {
  if (typeof chords === "string") {
    return chords;
  }

  return chords
    .map(chord => {
      return `${
        (chord as TypeChordWithString).string
          ? (chord as TypeChordWithString).string
          : `${(chord as TypeChordWithBarre).barre.until}x`
      },${chord.fret}${chord.finger ? `,${chord.finger}` : ""}`;
    })
    .join("|");
}

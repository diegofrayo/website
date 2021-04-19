import React, { Fragment, useRef, useState } from "react";
import classNames from "classnames";

import { Space, Button, Title } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { T_ReactElement } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { createArray, safeCastNumber } from "~/utils/misc";

import twcss from "./../twcss";
import Service from "./service";

interface T_ChordBase {
  fret: number;
  finger?: number;
}

interface T_ChordWithString extends T_ChordBase {
  string: number;
}

interface T_ChordWithBarre extends T_ChordBase {
  barre: { until: number };
}

type T_Chord = T_ChordWithString | T_ChordWithBarre;

type T_ChordsProps = {
  name: string;
  chords: Array<T_Chord> | string; // "STRING,FRET,FINGER" | "STRING,FRET"
  stringsToSkip?: Array<number> | string; // "Number,Number"
  showOptions?: boolean;
};

const ChordsService = new Service();

export function Chords({
  name,
  chords,
  stringsToSkip,
  showOptions = true,
}: T_ChordsProps): T_ReactElement {
  const chordRef = useRef<HTMLDivElement>(null);
  const [showInput, setShowInput] = useState<boolean>(false);

  const {
    error,
    chordsGroupedByFret,
    chordsToString,
    firstFret,
    lastFret,
  } = ChordsService.groupChordsByFret(chords);

  function handleDownloadAsImage(): void {
    ChordsService.downloadChordAsImage(chordRef, name);
  }

  function handleShowInput(): void {
    setShowInput((cs) => !cs);
  }

  if (error) {
    return (
      <strong className="tw-block tw-text-red-700 dark:tw-text-red-400 tw-mt-2">
        Chords syntax error: {error.message}
      </strong>
    );
  }

  return (
    <article className="tw-max-w-full tw-text-center tw-font-serif">
      <section ref={chordRef}>
        <Title
          is="h1"
          variant={Title.variant.SECONDARY}
          className="tw-truncate tw-text-center tw-mb-2"
          size={Title.size.MD}
        >
          {name}
        </Title>
        <div className="tw-inline-flex tw-flex-no-wrap tw-overflow-x-auto tw-max-w-full tw-items-end">
          <Fret variant="FRET_STRINGS_NAMES" />
          <div className="tw-relative tw-inline-flex tw-flex-no-wrap">
            <Fret variant="FRET_EMPTY" fret={lastFret + 1} />
            {Object.entries(chordsGroupedByFret)
              .reverse()
              .map(([fret, chords]: [string, T_Chord[]]) => {
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
          {stringsToSkip && <Fret variant="FRET_SKIP_STRINGS" stringsToSkip={stringsToSkip} />}
        </div>
      </section>

      {showOptions && (
        <Fragment>
          <div className="tw-pt-2">
            <Button
              className="tw-text-sm tw-font-bold tw-p-1 tw-transition-opacity hover:tw-opacity-75"
              onClick={handleDownloadAsImage}
            >
              <Emoji className="tw-mr-1">⬇️</Emoji>
              <span>download as image</span>
            </Button>
            <Space size={1} orientation="v" />
            {chordsToString && (
              <Fragment>
                <Button
                  className="tw-text-sm tw-font-bold tw-py-1 tw-px-2 tw-transition-opacity hover:tw-opacity-75"
                  onClick={handleShowInput}
                >
                  <span
                    className={classNames(
                      "tw-inline-block tw-transition-all tw-transform tw-mr-1",
                      showInput && "tw-rotate-90",
                    )}
                  >
                    ‣
                  </span>
                  <span>{showInput ? "hide" : "show"} input</span>
                </Button>
                <Space size={1} orientation="v" />
              </Fragment>
            )}
            <Button
              className="tw-text-sm tw-font-bold tw-p-1 tw-transition-opacity hover:tw-opacity-75"
              data-clipboard-text={chordsToString || "Empty chord"}
              onClick={copyToClipboard}
            >
              <Emoji>📋</Emoji> copy input to clipboard
            </Button>
          </div>
          {showInput && (
            <div className="tw-text-sm tw-mt-4">
              <strong className="tw-block tw-mb-1">input:</strong>
              <pre className="tw-whitespace-pre-line tw-text-sm tw-break-all">{chordsToString}</pre>
            </div>
          )}
        </Fragment>
      )}
    </article>
  );
}

type T_String = 1 | 2 | 3 | 4 | 5 | 6;
type T_Fret = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export function Solo({
  positions,
  notes,
}: {
  positions: string | { string?: T_String; fret?: T_Fret; space?: number }[];
  notes: string;
}): T_ReactElement {
  function getPositions(): { string?: T_String; fret?: T_Fret; space?: number }[] {
    if (typeof positions === "string") {
      return ["|", ...positions.split("|"), "|"].map((position) => {
        const [string, fret] = position.split(",");

        return {
          string: safeCastNumber(string) as T_String,
          fret: safeCastNumber(fret) as T_Fret,
          space: 0,
        };
      });
    }

    return [{ space: 1 }, ...positions, { space: 1 }];
  }

  return (
    <div className="tw-text-sm tw-pr-2 tw-font-serif">
      <div className="tw-flex tw-items-end">
        <Fret variant="FRET_STRINGS_NAMES" />

        {getPositions().map((position, index) => {
          if (position.space) {
            return createArray(position.space).map(() => {
              return (
                <div key={`Solo-position-${index}`} className="tw-ml-1">
                  {createArray(6)
                    .reverse()
                    .map((i) => {
                      return (
                        <div key={`Solo-position-${index}-${i}`} className="tw-h-6">
                          -
                        </div>
                      );
                    })}
                </div>
              );
            });
          }

          return (
            <div key={`Solo-position-${index}`} className="tw-ml-1">
              <div>
                {createArray(6)
                  .reverse()
                  .map((i) => {
                    if (i === Number(position.string)) {
                      return (
                        <div key={`Solo-position-${index}-${i}`} className="tw-h-6">
                          {position.fret !== undefined ? position.fret : "0"}
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
      <p className="tw-mt-4 tw-ml-2 tw-whitespace-pre-line tw-break-word tw-italic">
        {`"${notes}"`}
      </p>
    </div>
  );
}

// --- Components ---

type T_FretProps = {
  variant: "FRET_DEFAULT" | "FRET_STRINGS_NAMES" | "FRET_EMPTY" | "FRET_SKIP_STRINGS";
  fret?: undefined | number;
  chords?: undefined | Array<T_Chord>;
  stringsToSkip?: T_ChordsProps["stringsToSkip"];
};

function Fret({ variant, fret, chords, stringsToSkip }: T_FretProps): T_ReactElement {
  const isEmptyVariant = variant === "FRET_EMPTY";
  const isStringsNamesVariant = variant === "FRET_STRINGS_NAMES";
  const isSkipStringsVariant = variant === "FRET_SKIP_STRINGS";
  const isDefaultVariant = variant === "FRET_DEFAULT";
  const STRINGS_NAMES = ["E-[mi]", "A-[la]", "D-[re]", "G-[sol]", "B-[si]", "E-[mi]"].reverse();

  return (
    <div
      className={classNames(
        "tw-flex-shrink-0 tw-text-xs",
        isSkipStringsVariant ? "tw-auto" : isStringsNamesVariant ? "tw-w-16" : "tw-w-10",
      )}
    >
      {!isStringsNamesVariant && (
        <div className="tw-flex tw-items-center tw-justify-center tw-h-6 tw-font-bold">
          {fret || ""}
        </div>
      )}
      <div
        className={classNames(
          !isStringsNamesVariant &&
            !isSkipStringsVariant &&
            "tw-border-l-2 tw-border-r-2 tw-border-yellow-400 tw-bg-yellow-700",
        )}
      >
        {createArray(6)
          .reverse()
          .map((string) => {
            const isBarreChord =
              isDefaultVariant &&
              Array.isArray(chords) &&
              ((chords.length > 0 ? chords[0] : {}) as T_ChordWithBarre).barre !== undefined;
            const chord =
              isBarreChord && chords
                ? chords[0]
                : isDefaultVariant
                ? chords?.find((chord: T_ChordWithString) => chord.string === string)
                : undefined;

            return (
              <div
                key={`Fret-${
                  isEmptyVariant
                    ? `empty-${string}`
                    : isStringsNamesVariant
                    ? `string-${string}`
                    : isBarreChord
                    ? `barre-${string}-${(chord as T_ChordWithBarre).fret}`
                    : chord
                    ? `default-${(chord as T_ChordWithString).string}-${chord.finger || ""}`
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
                    {((chord as T_ChordWithBarre)?.barre?.until as number) >= string && (
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
              </div>
            );
          })}
      </div>
    </div>
  );
}

const String = twcss.span`tw-border tw-border-black tw-bg-black tw-block tw-h-1 tw-flex-1`;

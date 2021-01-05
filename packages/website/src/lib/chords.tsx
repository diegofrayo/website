import React, { Fragment } from "react";
import classnames from "classnames";

import { createArray } from "~/utils/misc";

import twcss from "./twcss";

type TypeChord = {
  finger: number;
  string: number;
  fret: number;
};

type TypeChordsProps = {
  name: string;
  chords: Array<TypeChord>;
};

function Chords({ name, chords }: TypeChordsProps): any {
  const { firstFret, lastFret, chordsGroupedByFret } = groudChordsByFret(chords);

  return (
    <article className="tw-w-full tw-max-w-full tw-overflow-x-auto">
      <h1 className="tw-text-center tw-font-bold tw-mb-4">{name}</h1>
      <section className="tw-flex tw-flex-no-wrap tw-justify-start sm:tw-justify-center">
        <Fret variant="strings-names" />
        <section className="tw-flex tw-bg-yellow-700">
          <Fret fret={lastFret + 1} variant="strings-empty"></Fret>
          <section className="tw-flex">
            {Object.entries(chordsGroupedByFret)
              .reverse()
              .map(([fret, chords]: [string, TypeChord[]]) => {
                return (
                  <Fret key={`Fret-${fret}`} fret={Number(fret)} chords={chords}></Fret>
                );
              })}
          </section>
          {firstFret - 1 > 0 && <Fret fret={firstFret - 1} variant="strings-empty" />}
        </section>
      </section>
    </article>
  );
}

// --- Components ---

type TypeFretProps = {
  chords?: undefined | Array<TypeChord>;
  fret?: undefined | number;
  variant?: undefined | "strings-names" | "strings-empty";
};

function Fret({ fret, chords, variant }: TypeFretProps) {
  const isStringsEmptyVariant = variant === "strings-empty";
  const isStringsNamesVariant = variant === "strings-names";
  const isDefaultVariant = !variant;
  const STRINGS_NAMES = [
    "E (mi)",
    "A (la)",
    "D (re)",
    "G (sol)",
    "B (si)",
    "E (mi)",
  ].reverse();

  return (
    <div
      className={classnames(
        "tw-text-center tw-flex-shrink-0 tw-text-sm",
        isStringsNamesVariant ? "tw-w-20" : "tw-w-16",
      )}
    >
      <div className="tw-flex tw-items-center tw-justify-center tw-h-10 tw-font-bold tw-bg-white">
        {fret || ""}
      </div>
      <div
        className={classnames(
          "tw-w-full",
          !isStringsNamesVariant && "tw-border-l-2 tw-border-r-2 tw-border-yellow-300",
        )}
      >
        {createArray(6, 1)
          .reverse()
          .map(item => {
            const chord =
              isDefaultVariant && chords?.find(chord => chord.string === item);

            return (
              <div
                key={`Fret-${
                  isStringsEmptyVariant
                    ? `empty-${item}`
                    : isStringsNamesVariant
                    ? `names-${item}`
                    : chord
                    ? `${chord.string}-${chord.finger}`
                    : `string-${item}`
                }`}
                className="tw-flex tw-items-center tw-w-full tw-h-10"
              >
                {isStringsNamesVariant ? (
                  <div className="tw-flex tw-justify-between tw-px-2 tw-w-full">
                    <span>{STRINGS_NAMES[item - 1]}</span>
                    <strong>{item}</strong>
                  </div>
                ) : (
                  <Fragment>
                    <String></String>
                    {chord && (
                      <Fragment>
                        <span className="tw-rounded-full tw-h-6 tw-w-6 tw-border tw-font-bold tw-bg-white tw-text-black">
                          {chord.finger}
                        </span>
                        <String></String>
                      </Fragment>
                    )}
                  </Fragment>
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

function groudChordsByFret(chords) {
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

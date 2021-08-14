import React, { Fragment } from "react";
import classNames from "classnames";

import twcss from "~/lib/twcss";
import { T_ReactElement } from "~/types";
import { createArray, mirror } from "~/utils/misc";

import { NUMBER_OF_STRINGS } from "../constants";
import {
  T_MusicNote,
  T_GuitarFret,
  T_GuitarPlayedStrings,
  I_BarreMusicNote,
  I_SimpleMusicNote,
} from "../types";

type T_Variants = "DEFAULT" | "STRINGS_NAMES" | "EMPTY" | "SKIPPED_STRINGS";
const VARIANTS = mirror(["DEFAULT", "STRINGS_NAMES", "EMPTY", "SKIPPED_STRINGS"]) as Record<
  T_Variants,
  T_Variants
>;

type T_GuitarFretProps = {
  variant: T_Variants;
  number?: T_GuitarFret;
  musicNotes?: T_MusicNote[];
  playedStrings?: T_GuitarPlayedStrings;
};

function GuitarFret(props: T_GuitarFretProps): T_ReactElement {
  const {
    // props
    musicNotes,
    number,
    playedStrings,

    // utils
    getSkippedStringValue,

    // vars
    STRINGS_NAMES,
    isDefaultVariant,
    isEmptyVariant,
    isSkippedStringsVariant,
    isStringsNamesVariant,
  } = useController(props);

  return (
    <div
      className={classNames(
        "tw-flex-shrink-0 tw-text-xs",
        isSkippedStringsVariant ? "tw-auto" : isStringsNamesVariant ? "tw-w-16" : "tw-w-10",
      )}
    >
      {!isStringsNamesVariant && (
        <div className="tw-flex tw-items-center tw-justify-center tw-h-6 tw-font-bold">
          {number}
        </div>
      )}
      <div
        className={classNames(
          !isStringsNamesVariant &&
            !isSkippedStringsVariant &&
            "tw-border-l-2 tw-border-r-2 tw-border-yellow-400 tw-bg-yellow-700",
        )}
      >
        {createArray(NUMBER_OF_STRINGS)
          .reverse()
          .map((guitarString) => {
            const isBarreMusicNote =
              isDefaultVariant &&
              Array.isArray(musicNotes) &&
              ((musicNotes.length > 0 ? musicNotes[0] : {}) as I_BarreMusicNote).barre !==
                undefined;
            const musicNote =
              isBarreMusicNote && musicNotes
                ? musicNotes[0]
                : isDefaultVariant
                ? musicNotes?.find(
                    (chord) => (chord as I_SimpleMusicNote).guitarString === guitarString,
                  )
                : undefined;

            return (
              <div
                key={`${
                  isEmptyVariant
                    ? `empty-${guitarString}`
                    : isStringsNamesVariant
                    ? `guitarString-${guitarString}`
                    : isBarreMusicNote
                    ? `barre-${guitarString}-${(musicNote as I_BarreMusicNote).guitarFret}`
                    : musicNote
                    ? `default-${(musicNote as I_SimpleMusicNote).guitarString}-${
                        (musicNote as I_SimpleMusicNote).finger
                      }`
                    : `${guitarString}-${Date.now()}`
                }`}
                className="tw-flex tw-items-center tw-h-6"
              >
                {isStringsNamesVariant ? (
                  <div className="tw-flex tw-justify-between tw-w-full tw-px-2">
                    <span>{STRINGS_NAMES[guitarString - 1]}</span>
                    <strong>{guitarString}</strong>
                  </div>
                ) : isSkippedStringsVariant ? (
                  <span className="tw-px-2">
                    {getSkippedStringValue(playedStrings, guitarString)}
                  </span>
                ) : isBarreMusicNote ? (
                  <Fragment>
                    <String />
                    {(musicNote as I_BarreMusicNote)?.barre >= guitarString && (
                      <span className="tw-h-full tw-border-4" />
                    )}
                    <String />
                  </Fragment>
                ) : musicNote ? (
                  <Fragment>
                    <String />
                    <span className="tw-rounded-full tw-h-5 tw-w-5 tw-border tw-font-bold tw-bg-white tw-text-black">
                      {(musicNote as I_SimpleMusicNote).finger}
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

GuitarFret.variant = VARIANTS;

export default GuitarFret;

// --- Controller ---

function useController({ variant, ...rest }: T_GuitarFretProps) {
  const STRINGS_NAMES = ["E-[mi]", "A-[la]", "D-[re]", "G-[sol]", "B-[si]", "E-[mi]"].reverse();
  const isDefaultVariant = variant === VARIANTS.DEFAULT;
  const isEmptyVariant = variant === VARIANTS.EMPTY;
  const isSkippedStringsVariant = variant === VARIANTS.SKIPPED_STRINGS;
  const isStringsNamesVariant = variant === VARIANTS.STRINGS_NAMES;

  function getSkippedStringValue(
    playedStrings: T_GuitarFretProps["playedStrings"],
    guitarString: number,
  ): string | T_ReactElement {
    if (!playedStrings) return "";

    const playedString = playedStrings[guitarString - 1];

    if (playedString === "0") return "⚬";
    if (playedString === "1") return "⚈";
    if (playedString === "x") {
      return <span className="tw-text-xs tw-relative tw--left-1px">✕</span>;
    }

    return "⚈";
  }

  return {
    // props
    ...rest,

    // utils
    getSkippedStringValue,

    // vars
    STRINGS_NAMES,
    isDefaultVariant,
    isEmptyVariant,
    isSkippedStringsVariant,
    isStringsNamesVariant,
  };
}

// --- Components ---

const String = twcss.span`tw-border tw-border-black tw-bg-black tw-block tw-h-1 tw-flex-1`;

import React from "react";
import classNames from "classnames";

import { Space } from "~/components/primitive";
import { T_ReactChildrenProp, T_ReactElement } from "~/types";
import { createArray } from "~/utils/misc";

import GuitarFret from "./GuitarFret";
import { NUMBER_OF_STRINGS } from "../constants";
import { T_GuitarFret, T_GuitarString } from "../types";
import {
  checkGuitarFretValidity,
  checkGuitarStringValidity,
  checkTablatureSpaceValidity,
} from "../utils";

interface I_SpacePosition {
  space: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "x";
}

interface I_GuitarStringPosition {
  guitarString: T_GuitarString;
}

interface I_BarrePosition {
  guitarFret: T_GuitarFret;
}

interface I_MusicNotePosition {
  guitarFret: T_GuitarFret;
  guitarString: T_GuitarString;
}

type T_Position = (
  | I_SpacePosition
  | I_GuitarStringPosition
  | I_BarrePosition
  | I_MusicNotePosition
) & {
  variant: "SPACE" | "GUITAR_STRING" | "MUSIC_NOTE" | "BARRE";
};

type T_TablatureProps = {
  positions?: (T_Position | T_Position[])[];
  notes?: string;
};

function Tablature(props: T_TablatureProps): T_ReactElement {
  const {
    // props
    notes,

    // vars
    parsedPositions,
  } = useController(props);

  return (
    <div className="tw-text-base">
      {parsedPositions && (
        <div className="tw-flex tw-items-end">
          <GuitarFret variant={GuitarFret.variant.STRINGS_NAMES} />

          {parsedPositions.map((position, positionIndex) => {
            if ((position as T_Position).variant === "SPACE") {
              return createArray(
                typeof (position as I_SpacePosition).space === "number"
                  ? ((position as I_SpacePosition).space as number)
                  : 1,
              ).map((space) => {
                return (
                  <div key={`Tablature-position-${positionIndex}-${space}`} className="tw-ml-1">
                    {createArray(NUMBER_OF_STRINGS)
                      .reverse()
                      .map((guitarString) => {
                        return (
                          <Position
                            key={`Position-${positionIndex}-${space}-${guitarString}`}
                            isSeparator={(position as I_SpacePosition).space === "x"}
                            isCell
                          />
                        );
                      })}
                  </div>
                );
              });
            }

            return (
              <div key={`Tablature-position-${positionIndex}`} className="tw-ml-1">
                <div>
                  {createArray(NUMBER_OF_STRINGS)
                    .reverse()
                    .map((guitarString) => {
                      if (Array.isArray(position)) {
                        const musicNotePosition = position.find(
                          (position) =>
                            (position as I_MusicNotePosition).guitarString === guitarString,
                        ) as I_MusicNotePosition;

                        if (musicNotePosition) {
                          return (
                            <Position key={`Position-${positionIndex}-${guitarString}`}>
                              {musicNotePosition.guitarFret || "0"}
                            </Position>
                          );
                        }

                        const barrePosition = position.find(
                          (position) => position.variant === "BARRE",
                        ) as I_BarrePosition;

                        if (barrePosition) {
                          return (
                            <Position key={`Position-${positionIndex}-${guitarString}`}>
                              {barrePosition.guitarFret}
                            </Position>
                          );
                        }
                      }

                      if ((position as I_MusicNotePosition).guitarString === guitarString) {
                        return (
                          <Position key={`Position-${positionIndex}-${guitarString}`}>
                            {(position as I_MusicNotePosition).guitarFret}
                          </Position>
                        );
                      }

                      return <Position key={`Position-${positionIndex}-${guitarString}`} isCell />;
                    })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {parsedPositions && notes && <Space size={1} />}

      {notes && (
        <p className="tw-ml-2 tw-whitespace-pre-line tw-break-word tw-italic">{`"${notes}"`}</p>
      )}
    </div>
  );
}

export default Tablature;

// --- Controller ---

function useController({ positions, notes }: T_TablatureProps): Pick<T_TablatureProps, "notes"> & {
  parsedPositions: T_TablatureProps["positions"] | undefined;
} {
  function getPositions(positions: T_TablatureProps["positions"]): (T_Position | T_Position[])[] {
    return (positions || []).map((position) => {
      if (Array.isArray(position)) {
        return position.map((position) => {
          return validAndParsePosition(position);
        });
      }

      return validAndParsePosition(position);
    });
  }

  function validAndParsePosition(position): T_Position {
    let positionVariant = "";

    if (typeof (position as I_SpacePosition).space === "number" || position.space === "x") {
      checkTablatureSpaceValidity((position as I_SpacePosition).space);
      positionVariant = "SPACE";
    } else {
      const hasGuitarStringParam =
        typeof (position as I_MusicNotePosition).guitarString === "number";
      const hasGuitarFretParam = typeof (position as I_BarrePosition).guitarFret === "number";

      if (hasGuitarStringParam && !hasGuitarFretParam) {
        checkGuitarStringValidity((position as I_MusicNotePosition).guitarString);
        positionVariant = "GUITAR_STRING";
      } else if (hasGuitarFretParam && !hasGuitarStringParam) {
        checkGuitarFretValidity((position as I_MusicNotePosition).guitarFret);
        positionVariant = "BARRE";
      } else if (hasGuitarFretParam && hasGuitarStringParam) {
        checkGuitarStringValidity((position as I_MusicNotePosition).guitarString);
        checkGuitarFretValidity((position as I_MusicNotePosition).guitarFret);
        positionVariant = "MUSIC_NOTE";
      } else {
        throw new Error("Invalid tablature position");
      }
    }

    return { ...position, variant: positionVariant } as T_Position;
  }

  return {
    // props
    notes,

    // vars
    parsedPositions:
      positions && positions.length > 0
        ? [
            { space: 1, variant: "SPACE" },
            ...getPositions(positions),
            { space: 1, variant: "SPACE" },
          ]
        : undefined,
  };
}

// --- Components ---

function Position({
  children,
  isCell = false,
  isSeparator = false,
}: {
  children?: T_ReactChildrenProp;
  isCell?: boolean;
  isSeparator?: boolean;
}): T_ReactElement {
  return (
    <div
      className={classNames(
        "root tw-h-6 tw-w-4 tw-text-center tw-relative tw-top-0.5",
        isCell && "root--cell",
        isSeparator && "root--separator",
      )}
    >
      {!isCell && <span>{children || "0"}</span>}

      <style jsx>{`
        .root--cell::before {
          background-color: black;
          content: "";
          display: inline-block;
          height: 1px;
          left: 0;
          max-width: 100%;
          position: absolute;
          top: 10px;
          width: 100%;
        }

        .root--separator::before {
          height: 100%;
          left: 8px;
          max-height: 100%;
          top: 0;
          width: 1px;
        }

        :global(.tw-dark) .root--cell::before {
          background-color: white;
        }
      `}</style>
    </div>
  );
}

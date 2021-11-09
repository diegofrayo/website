import * as React from "react";
import classNames from "classnames";

import { Space, Block, Text, InlineText } from "~/components/primitive";
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
    <Block className="tw-text-base">
      {parsedPositions && (
        <Block className="tw-flex tw-items-end">
          <GuitarFret variant={GuitarFret.variant.STRINGS_NAMES} />

          {parsedPositions.map((position, positionIndex) => {
            if ((position as T_Position).variant === "SPACE") {
              return createArray(
                typeof (position as I_SpacePosition).space === "number"
                  ? ((position as I_SpacePosition).space as number)
                  : 1,
              ).map((space) => {
                return (
                  <Block key={`Tablature-position-${positionIndex}-${space}`} className="tw-ml-1">
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
                  </Block>
                );
              });
            }

            return (
              <Block key={`Tablature-position-${positionIndex}`} className="tw-ml-1">
                <Block>
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
                </Block>
              </Block>
            );
          })}
        </Block>
      )}

      {parsedPositions && notes && <Space size={1} />}

      {notes && (
        <Text className="tw-ml-2 tw-whitespace-pre-line tw-break-word tw-italic">{`"${notes}"`}</Text>
      )}
    </Block>
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
    <Block
      className={classNames(
        "dfr-Tablature-Position tw-h-6 tw-text-center tw-relative tw-top-0.5 tw-w-6",
        isCell && "dfr-Tablature-Position--cell",
        isSeparator && "dfr-Tablature-Position--separator",
      )}
    >
      {!isCell && <InlineText>{children || "0"}</InlineText>}

      <style jsx>{`
        :global(.dfr-Tablature-Position--cell::before) {
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

        :global(.dfr-Tablature-Position--separator::before) {
          height: 100%;
          left: 8px;
          max-height: 100%;
          top: 0;
          width: 1px;
        }

        :global(.tw-dark) :global(.dfr-Tablature-Position--cell::before) {
          background-color: white;
        }
      `}</style>
    </Block>
  );
}

import { createArray } from "~/utils/misc";

import { T_ReactRefObject } from "~/types";

class ChordsService {
  async downloadChordAsImage(
    containerRef: T_ReactRefObject<HTMLDivElement>,
    chordName: string,
  ): Promise<void> {
    const domtoimage = await import("dom-to-image");

    domtoimage.toPng(containerRef.current, { quality: 1 }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${chordName}.png`;
      link.href = dataUrl;
      link.click();
    });
  }

  groupChordsByFret(
    chordsParam: T_GroupChordsByFretParams,
  ): {
    chordsToString: string;
    firstFret: number;
    lastFret: number;
    chordsGroupedByFret: any;
    error: Error | undefined;
  } {
    try {
      const chords: T_Chord[] =
        chordsParam === ""
          ? []
          : typeof chordsParam === "string"
          ? chordsParam.split("|").map(
              (item: string): T_Chord => {
                const [string, fret, finger, ...more] = item.split(",");

                if (!item || more.length > 0) throw new Error("Syntax error");

                const chord: Partial<T_Chord> = {
                  finger: finger === undefined ? undefined : Number(finger),
                  fret: Number(fret),
                };

                this.checkFretValidity(chord.fret || 0);

                if (string.includes("x")) {
                  (chord as T_ChordWithBarre).barre = {
                    until: string.length === 2 ? Number(string[0]) : 6,
                  };
                } else {
                  (chord as T_ChordWithString).string = Number(string);
                }

                return chord as T_Chord;
              },
            )
          : (chordsParam as T_Chord[]);

      const frets: number[] = chords.map((chord) => chord.fret).sort();

      const chordsGroupedByFret =
        chords.length === 0
          ? {}
          : chords.reduce(
              (result, chord) => {
                this.checkFingerValidity(chord.finger);

                if ((chord as T_ChordWithBarre).barre !== undefined) {
                  this.checkBarreValidity((chord as T_ChordWithBarre).barre.until);
                } else {
                  this.checkStringValidity((chord as T_ChordWithString).string);
                }

                result[`${chord.fret}`].push(chord);

                if (
                  result[`${chord.fret}`].find((item) => item.barre !== undefined) !== undefined &&
                  result[`${chord.fret}`].length > 1
                ) {
                  throw new Error("A fret contains a barre chord can't have multiple chords");
                }

                return result;
              },
              createArray(Math.max(...frets) - Math.min(...frets) + 1, Math.min(...frets)).reduce(
                (result, fret) => {
                  result[`${fret}`] = [];
                  return result;
                },
                {},
              ),
            );

      return {
        error: undefined,
        chordsToString: this.chordsToString(chordsParam),
        firstFret: frets.length > 0 ? frets[0] : 0,
        lastFret: frets.length > 0 ? frets[frets.length - 1] : 0,
        chordsGroupedByFret,
      };
    } catch (error) {
      console.error("Error parsing chords");
      console.error(error);

      return {
        chordsToString: "",
        firstFret: 0,
        lastFret: 0,
        chordsGroupedByFret: {},
        error,
      };
    }
  }

  checkFingerValidity(finger?: number): void {
    if (finger === undefined) return;

    if (Number.isNaN(finger) || finger < 1 || finger > 4) {
      throw new Error("Invalid finger");
    }
  }

  checkFretValidity(fret: number): void {
    if (Number.isNaN(fret) || fret < 1 || fret > 20) {
      throw new Error("Invalid fret");
    }
  }

  checkStringValidity(string: number): void {
    if (Number.isNaN(string) || string < 1 || string > 6) {
      throw new Error("Invalid string");
    }
  }

  checkBarreValidity(until: number): void {
    if (Number.isNaN(until) || until < 3 || until > 6) {
      throw new Error("Invalid barre chord");
    }
  }

  chordsToString(chords: T_ChordsProps["chords"]): string {
    if (typeof chords === "string") {
      return chords;
    }

    return chords
      .map((chord) => {
        return `${
          (chord as T_ChordWithString).string
            ? (chord as T_ChordWithString).string
            : `${(chord as T_ChordWithBarre).barre.until}x`
        },${chord.fret}${chord.finger ? `,${chord.finger}` : ""}`;
      })
      .join("|");
  }
}

export default ChordsService;

// --- T_s ---

type T_GroupChordsByFretParams = T_ChordsProps["chords"];

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
  chords: T_Chord[] | string; // "STRING,FRET,FINGER" | "STRING,FRET"
  stringsToSkip?: number[] | string; // "Number,Number"
  showOptions?: boolean;
};

import { createArray } from "~/utils/misc";

class ChordsService {
  async downloadChordAsImage(containerRef): Promise<void> {
    const domtoimage = await import("dom-to-image");

    domtoimage.toPng(containerRef.current, { quality: 1 }).then(dataUrl => {
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = dataUrl;
      link.click();
    });
  }

  groupChordsByFret(chordsParam: TypeGroupChordsByFretParams) {
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

                this.checkFretValidity(chord.fret || 0);

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
                this.checkFingerValidity(chord.finger);

                if ((chord as TypeChordWithBarre).barre !== undefined) {
                  this.checkBarreValidity((chord as TypeChordWithBarre).barre.until);
                } else {
                  this.checkStringValidity((chord as TypeChordWithString).string);
                }

                result[`${chord.fret}`].push(chord);

                if (
                  result[`${chord.fret}`].find(item => item.barre !== undefined) !== undefined &&
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

  chordsToString(chords: TypeChordsProps["chords"]): string {
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
}

export default ChordsService;

// --- Types ---

type TypeGroupChordsByFretParams = TypeChordsProps["chords"];

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

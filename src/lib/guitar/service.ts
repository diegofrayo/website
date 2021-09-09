import { createArray, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";
import { replaceAll } from "~/utils/strings";

import {
  I_BarreMusicNote,
  I_SimpleMusicNote,
  T_Chord,
  T_GroupedMusicNotesByGuitarFret,
  T_GuitarFret,
  T_MusicNote,
  T_ParsedChord,
} from "./types";
import {
  parseFret,
  checkBarreChordValidity,
  checkFingerValidity,
  checkGuitarStringValidity,
  isBarreChord,
  parseBarre,
  parseFinger,
  parseGuitarString,
  checkGuitarFretValidity,
} from "./utils";
import CHORDS from "./data/chords.json";

class GuitarService {
  buildChord(musicNotes: T_MusicNote[] | string): T_ParsedChord {
    try {
      const parsedMusicNotes: T_MusicNote[] =
        musicNotes === ""
          ? []
          : typeof musicNotes === "string"
          ? musicNotes.split("|").map((musicNote: string): T_MusicNote => {
              const [guitarString, guitarFret, finger, ...more] = musicNote.split(",");

              if (!musicNote) {
                throw new Error(
                  "You have entered a empty music note, probably you entered a '|' character at the end",
                );
              }

              if (more.length > 0) {
                throw new Error(
                  "A music note only can have 3 elements (guitarString,guitarFret,finger?) as maximum",
                );
              }

              // TODO: Review this typing
              const parsedMusicNote: Partial<T_MusicNote> = {
                guitarFret: parseFret(guitarFret),
              };

              if (isBarreChord(guitarString)) {
                (parsedMusicNote as I_BarreMusicNote).barre = parseBarre(guitarString);
              } else {
                (parsedMusicNote as I_SimpleMusicNote).guitarString =
                  parseGuitarString(guitarString);
                (parsedMusicNote as I_SimpleMusicNote).finger = parseFinger(finger);
              }

              return parsedMusicNote as T_MusicNote;
            })
          : musicNotes;

      const musicNotesFrets: T_GuitarFret[] = parsedMusicNotes
        .map((musicNote) => {
          checkGuitarFretValidity(musicNote.guitarFret);
          return musicNote.guitarFret;
        })
        .sort();

      if (musicNotesFrets.length === 0) {
        throw new Error("A chord must have at least one music note");
      }

      const groupedMusicNotesByGuitarFret = parsedMusicNotes.reduce(
        (
          result: T_GroupedMusicNotesByGuitarFret,
          musicNote: T_MusicNote,
        ): T_GroupedMusicNotesByGuitarFret => {
          if ((musicNote as I_BarreMusicNote).barre !== undefined) {
            checkBarreChordValidity((musicNote as I_BarreMusicNote).barre);
          } else {
            checkFingerValidity((musicNote as I_SimpleMusicNote).finger);
            checkGuitarStringValidity((musicNote as I_SimpleMusicNote).guitarString);
          }

          result[`${musicNote.guitarFret}`].push(musicNote);

          if (
            result[`${musicNote.guitarFret}`].find(
              (musicNote) => (musicNote as I_BarreMusicNote).barre !== undefined,
            ) !== undefined &&
            result[`${musicNote.guitarFret}`].length > 1
          ) {
            throw new Error("A barre chord can't share a fret with another music note");
          }

          return result;
        },
        createArray(
          Math.max(...musicNotesFrets) - Math.min(...musicNotesFrets) + 1,
          Math.min(...musicNotesFrets),
        ).reduce(
          (
            result: T_GroupedMusicNotesByGuitarFret,
            fret: T_GuitarFret,
          ): T_GroupedMusicNotesByGuitarFret => {
            result[`${fret}`] = [];
            return result;
          },
          {} as T_GroupedMusicNotesByGuitarFret,
        ),
      );

      return {
        firstFret: musicNotesFrets[0],
        lastFret: musicNotesFrets[musicNotesFrets.length - 1],
        musicNotesAsString: this.musicNotesToString(parsedMusicNotes),
        groupedMusicNotesByGuitarFret,
      };
    } catch (error) {
      console.error("Error creating a chord");
      console.error(error);
      throw error;
    }
  }

  formatText(songContent: string): string {
    const parsedContent = songContent
      .split("\n")
      .map((line) => {
        let parsedTextLine = line;

        line
          .split(" ")
          .filter(Boolean)
          .sort(this.sortChords)
          .forEach((chord, _, textLineItems) => {
            if (chord.includes("|")) {
              chord
                .split("|")
                .filter(Boolean)
                .forEach((chord, index) => {
                  parsedTextLine = this.parseTextLine({
                    parsedTextLine,
                    chord,
                    textLineItems,
                    replaceExactly: index > 0,
                  });
                });
            } else {
              parsedTextLine = this.parseTextLine({ parsedTextLine, chord, textLineItems });
            }
          });

        return parsedTextLine;
      })
      .join("\n");

    return parsedContent;
  }

  findChord(chordName: string, chordIndex?: number): T_Chord | undefined {
    const chord = CHORDS[chordName];

    if (!chord) {
      return undefined;
    }

    if (Array.isArray(chord)) {
      if (chordIndex === undefined) {
        return chord.map((chord) => {
          return transformObjectKeysFromSnakeCaseToLowerCamelCase({
            ...chord,
            name: chordName,
          });
        }) as T_Chord;
      }

      if (!chord[chordIndex]) {
        return undefined;
      }

      return transformObjectKeysFromSnakeCaseToLowerCamelCase({
        ...chord[chordIndex],
        name: chordName,
      }) as T_Chord;
    }

    return transformObjectKeysFromSnakeCaseToLowerCamelCase({
      ...chord,
      name: chordName,
    }) as T_Chord;
  }

  private parseTextLine({ parsedTextLine, chord, textLineItems, replaceExactly = false }) {
    const chordHTML = this.chordToHTML(chord);

    if (textLineItems.length === 1 || replaceExactly) {
      return replaceAll(parsedTextLine, chord, chordHTML);
    }

    return replaceAll(
      replaceAll(
        replaceAll(
          replaceAll(parsedTextLine, ` ${chord} `, ` ${chordHTML} `),
          `${chord}|`,
          `${chordHTML}|`,
        ),
        `${chord} `,
        `${chordHTML} `,
      ),
      ` ${chord}`,
      ` ${chordHTML}`,
    );
  }

  private chordToHTML(chordNameInput: string): string {
    // TODO: Regex
    const isChordWithMultipleShapes = chordNameInput.includes("[") && chordNameInput.includes("]");
    const chordName = isChordWithMultipleShapes
      ? chordNameInput.substring(0, chordNameInput.lastIndexOf("["))
      : chordNameInput;
    // TODO: Regex
    const chordIndex =
      Number(
        isChordWithMultipleShapes
          ? replaceAll(chordNameInput.substring(chordNameInput.lastIndexOf("[")), ["[", "]"], "")
          : 1,
      ) - 1;

    if (this.findChord(chordName, chordIndex)) {
      return `<button class="dfr-Chord dfr-text-color-links dark:dfr-text-color-links tw-mt-3 tw-mb-1" data-chord-index="${chordIndex}">${chordName}</button>`;
    }

    return chordNameInput;
  }

  private sortChords(a: string, b: string): number {
    if (a.length > b.length) {
      return -1;
    }

    if (a.length < b.length) {
      return 1;
    }

    return -1;
  }

  private musicNotesToString(musicNotes: T_MusicNote[]): string {
    return musicNotes
      .map((musicNote) => {
        return `${
          (musicNote as I_SimpleMusicNote).guitarString
            ? (musicNote as I_SimpleMusicNote).guitarString
            : `${(musicNote as I_BarreMusicNote).barre}x`
        },${musicNote.guitarFret}${
          (musicNote as I_SimpleMusicNote).finger
            ? `,${(musicNote as I_SimpleMusicNote).finger}`
            : ""
        }`;
      })
      .join("|");
  }
}

export default new GuitarService();

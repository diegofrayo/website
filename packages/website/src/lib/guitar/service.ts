import {
  createArray,
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/misc";
import { replaceAll } from "~/utils/strings";

import {
  I_BarreMusicNote,
  I_SimpleMusicNote,
  T_ParsedChord,
  T_Finger,
  T_GroupedMusicNotesByGuitarFret,
  T_GuitarFret,
  T_GuitarString,
  T_MusicNote,
  T_Chord,
} from "./types";
import CHORDS from "./data/chords.json";

class ChordsService {
  create(musicNotes: T_MusicNote[] | string): T_ParsedChord {
    try {
      const parsedMusicNotes: T_MusicNote[] =
        musicNotes === ""
          ? []
          : typeof musicNotes === "string"
          ? musicNotes.split("|").map(
              (musicNote: string): T_MusicNote => {
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
                  guitarFret: this.parseFret(guitarFret),
                };

                if (this.isBarreChord(guitarString)) {
                  (parsedMusicNote as I_BarreMusicNote).barre = this.parseBarre(guitarString);
                } else {
                  (parsedMusicNote as I_SimpleMusicNote).guitarString = this.parseGuitarString(
                    guitarString,
                  );
                  (parsedMusicNote as I_SimpleMusicNote).finger = this.parseFinger(finger);
                }

                return parsedMusicNote as T_MusicNote;
              },
            )
          : musicNotes;

      const musicNotesFrets: T_GuitarFret[] = parsedMusicNotes
        .map((musicNote) => musicNote.guitarFret)
        .sort();

      if (musicNotesFrets.length === 0) {
        throw new Error("A chord must have at least one music note");
      }

      const groupedMusicNotesByGuitarFret = parsedMusicNotes.reduce(
        (
          result: T_GroupedMusicNotesByGuitarFret,
          musicNote: T_MusicNote,
        ): T_GroupedMusicNotesByGuitarFret => {
          this.checkGuitarFretValidity(musicNote.guitarFret);

          if ((musicNote as I_BarreMusicNote).barre !== undefined) {
            this.checkBarreChordValidity((musicNote as I_BarreMusicNote).barre);
          } else {
            this.checkFingerValidity((musicNote as I_SimpleMusicNote).finger);
            this.checkGuitarStringValidity((musicNote as I_SimpleMusicNote).guitarString);
          }

          result[`${musicNote.guitarFret}`].push(musicNote);

          if (
            result[`${musicNote.guitarFret}`].find((musicNote) => musicNote.barre !== undefined) !==
              undefined &&
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

  private parseFinger(finger: string): T_Finger | undefined {
    if (!finger) return undefined;

    return Number(finger) as T_Finger;
  }

  private parseFret(fret: string): T_GuitarFret {
    return Number(fret) as T_GuitarFret;
  }

  private parseGuitarString(string: string): T_GuitarString {
    return Number(string) as T_GuitarString;
  }

  private parseBarre(string: string): T_GuitarString {
    // TODO: Regex
    return string.length === 2 ? this.parseGuitarString(string.charAt(0)) : 6;
  }

  private isBarreChord(string: string): boolean {
    // TODO: Regex
    return string.includes("x");
  }

  private checkFingerValidity(value: T_Finger | undefined): boolean {
    if (!(typeof value === "number" && value >= 1 && value <= 4) && value !== undefined) {
      throw new Error(`Invalid finger (${value}). A finger must be between 1 and 4`);
    }

    return true;
  }

  checkGuitarStringValidity(value: number): boolean {
    if (Number.isNaN(value) || !(value >= 1 || value <= 6)) {
      throw new Error(`Invalid guitar string (${value}). A guitar string must be between 1 and 6`);
    }

    return true;
  }

  checkGuitarFretValidity(value: number): boolean {
    if (Number.isNaN(value) || !(value >= 1 || value <= 16)) {
      throw new Error(`Invalid guitar fret (${value}). A guitar fret must be between 1 and 16`);
    }

    return true;
  }

  checkTablatureSpaceValidity(value: number): boolean {
    if (Number.isNaN(value) || !(value >= 1 || value <= 10)) {
      throw new Error(
        `Invalid tablature space (${value}). A tablature space must be between 1 and 10`,
      );
    }

    return true;
  }

  private checkBarreChordValidity(value: number): boolean {
    return this.checkGuitarStringValidity(value);
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

  parseSongLyricsAndItsChords(songContent): string {
    const result = songContent
      .split("\n")
      .map((line) => {
        let transformedLine = line;

        line
          .split(" ")
          .filter(Boolean)
          .sort(sortBy(undefined, "desc"))
          .forEach((musicNote, _, array) => {
            if (musicNote.includes("|")) {
              musicNote.split("|").forEach((musicNoteItem) => {
                transformedLine = this.transformLine({
                  transformedLine,
                  musicNote: musicNoteItem,
                  array,
                });
              });
            } else {
              transformedLine = this.transformLine({ transformedLine, musicNote, array });
            }
          });

        return transformedLine;
      })
      .join("\n");

    return result;
  }

  private transformLine({ transformedLine, musicNote, array }) {
    if (array.length === 1) {
      return replaceAll(transformedLine, musicNote, this.insertChord(musicNote));
    } else {
      const musicNoteHTML = this.insertChord(musicNote);

      return replaceAll(
        replaceAll(
          replaceAll(transformedLine, `${musicNote} `, `${musicNoteHTML} `),
          ` ${musicNote}`,
          ` ${musicNoteHTML}`,
        ),
        `${musicNote}|`,
        `${musicNoteHTML}|`,
      );
    }
  }

  findChord(chordName: string): T_Chord | undefined {
    const chord = CHORDS[chordName];

    if (!chord || !chord.music_notes) return undefined;

    return transformObjectKeysFromSnakeCaseToLowerCamelCase({
      ...chord,
      name: chordName,
    }) as T_Chord;
  }

  private insertChord(chordName: string): string {
    if (this.findChord(chordName)) {
      return `<button class="dfr-Chord dfr-text-color-links dark:dfr-text-color-links tw-mt-3 tw-mb-1">${chordName}</button>`;
    }

    return chordName;
  }
}

export default new ChordsService();

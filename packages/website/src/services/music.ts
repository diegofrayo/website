import Data from "~/data/music/songs.json";
import { T_Song } from "~/types";
import { escapeRegExp, sortBy } from "~/utils/misc";

class MusicService {
  async fetchSongsList(): Promise<T_Song[]> {
    return Data.songs;
  }

  parseLyricsAndChords(songContent): string {
    const result = songContent
      .split("\n")
      .map(line => {
        let transformedLine = line;

        line
          .split(" ")
          .filter(Boolean)
          .sort(sortBy(undefined, "desc"))
          .forEach((chord, _, array) => {
            if (array.length === 1) {
              transformedLine = transformedLine.replace(
                new RegExp(escapeRegExp(chord), "g"),
                this.insertChord(chord),
              );
            } else {
              transformedLine = transformedLine
                .replace(new RegExp(escapeRegExp(`${chord} `), "g"), `${this.insertChord(chord)} `)
                .replace(new RegExp(escapeRegExp(` ${chord}`), "g"), ` ${this.insertChord(chord)}`);
            }
          });

        return transformedLine;
      })
      .join("\n");

    return result;
  }

  findChord(chord: string) {
    const chordData = Data.chords[chord];

    if (!chordData) return undefined;

    return {
      name: chord,
      chords: chordData.chords,
      stringsToSkip: chordData.strings_to_skip,
    };
  }

  private insertChord(chord: string): string {
    if (this.findChord(chord)) {
      return `<button class="chord dfr-text-color-links dark:dfr-text-color-links tw-mt-3 tw-mb-1">${chord}</button>`;
    }

    return chord;
  }
}

export default new MusicService();

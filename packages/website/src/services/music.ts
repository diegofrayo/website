import Data from "~/data/music/songs.json";
import { T_Chord, T_Primitive, T_Song } from "~/types";
import { sortBy } from "~/utils/misc";
import { replaceAll } from "~/utils/strings";

class MusicService {
  async fetchSongsList(): Promise<T_Song[]> {
    return Data.songs;
  }

  async getSong(config: Record<"id", T_Primitive>): Promise<T_Song> {
    const songs = await this.fetchSongsList();
    const song = songs.find((song) => song.id === config.id);

    if (song === undefined) {
      throw new Error(`Song not found. { config: "${JSON.stringify(config)}" }`);
    }

    return song;
  }

  parseLyricsAndChords(songContent): string {
    const result = songContent
      .split("\n")
      .map((line) => {
        let transformedLine = line;

        line
          .split(" ")
          .filter(Boolean)
          .sort(sortBy(undefined, "desc"))
          .forEach((chord, _, array) => {
            if (array.length === 1) {
              transformedLine = replaceAll(transformedLine, chord, this.insertChord(chord));
            } else {
              transformedLine = replaceAll(
                replaceAll(transformedLine, `${chord} `, `${this.insertChord(chord)} `),
                ` ${chord}`,
                ` ${this.insertChord(chord)}`,
              );
            }
          });

        return transformedLine;
      })
      .join("\n");

    return result;
  }

  findChord(chord: string): T_Chord | undefined {
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

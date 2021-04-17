import Data from "~/data/music/songs.json";
import { T_Chord, T_Primitive, T_Song } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";
import { replaceAll } from "~/utils/strings";

class MusicService {
  async fetchSongsList(): Promise<T_Song[]> {
    return Data.songs
      .map((song) => {
        return transformObjectKeysFromSnakeCaseToLowerCamelCase(song) as T_Song;
      })
      .sort(
        sortBy([
          { param: "progress", order: "desc" },
          { param: "title", order: "asc" },
        ]),
      );
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
            if (chord.includes("|")) {
              chord.split("|").forEach((chordItem) => {
                transformedLine = this.transformLine({ transformedLine, chord: chordItem, array });
              });
            } else {
              transformedLine = this.transformLine({ transformedLine, chord, array });
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

  private transformLine({ transformedLine, chord, array }) {
    if (array.length === 1) {
      return replaceAll(transformedLine, chord, this.insertChord(chord));
    } else {
      const chordHTML = this.insertChord(chord);

      return replaceAll(
        replaceAll(
          replaceAll(transformedLine, `${chord} `, `${chordHTML} `),
          ` ${chord}`,
          ` ${chordHTML}`,
        ),
        `${chord}|`,
        `${chordHTML}|`,
      );
    }
  }

  private insertChord(chord: string): string {
    if (this.findChord(chord)) {
      return `<button class="chord dfr-text-color-links dark:dfr-text-color-links tw-mt-3 tw-mb-1">${chord}</button>`;
    }

    return chord;
  }
}

export default new MusicService();

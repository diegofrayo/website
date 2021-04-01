import Data from "~/data/music/songs.json";
import { TypeSong } from "~/types";
import { escapeRegExp, sortBy } from "~/utils/misc";

async function fetchSongsList(): Promise<TypeSong[]> {
  return Data.songs;
}

function parseLyricsAndChords(songContent): string {
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
              insertChord(chord),
            );
          } else {
            transformedLine = transformedLine
              .replace(new RegExp(escapeRegExp(`${chord} `), "g"), `${insertChord(chord)} `)
              .replace(new RegExp(escapeRegExp(` ${chord}`), "g"), ` ${insertChord(chord)}`);
          }
        });

      return transformedLine;
    })
    .join("\n");

  return result;
}

function findChord(chord: string) {
  const chordData = Data.chords[chord];

  if (!chordData) return undefined;

  return {
    name: chord,
    chords: chordData.chords,
    stringsToSkip: chordData.strings_to_skip,
  };
}

export default {
  findChord,
  fetchSongsList,
  parseLyricsAndChords,
};

// --- Private ---

function insertChord(chord: string): string {
  if (findChord(chord)) {
    return `<button class="chord dfr-text-color-links dark:dfr-text-color-links tw-mt-4">${chord}</button>`;
  }

  return chord;
}

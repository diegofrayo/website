import { songs, chords } from "~/data/music/songs.json";
import { TypeSong } from "~/types";

import { escapeRegExp, sortBy } from "./misc";

export function getSongTitle(song: TypeSong): string {
  return `${song.title} | ${song.artist} | ${song.album}`;
}

export function getSongsList(): TypeSong[] {
  return songs;
}

export function parseSong(songContent): string {
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
              .replace(
                new RegExp(escapeRegExp(`${chord} `), "g"),
                `${insertChord(chord)} `,
              )
              .replace(
                new RegExp(escapeRegExp(` ${chord}`), "g"),
                ` ${insertChord(chord)}`,
              );
          }
        });

      return transformedLine;
    })
    .join("\n");

  return result;
}

export function getChord(chord: string) {
  const chordData = chords[chord];

  if (!chordData) return undefined;

  return {
    name: chord,
    chords: chordData.chords,
    stringsToSkip: chordData.strings_to_skip,
  };
}

function insertChord(chord: string): string {
  if (getChord(chord)) {
    return `<button class="chord twc-text-color-links dark:twc-text-color-links">${chord}</button>`;
  }

  return chord;
}

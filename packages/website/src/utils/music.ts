import { songs, chords } from "~/data/music/songs.json";
import { TypeSong } from "~/types";

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
        .forEach(chord => {
          transformedLine = transformedLine.replace(chord, insertChord(chord));
        });

      return transformedLine;
    })
    .join("\n");

  return result;
}

function insertChord(chord: string): string {
  if (chords[chord]) {
    return `<button class="chord twc-text-color-links dark:twc-text-color-links">${chord}</button>`;
  }

  return chord;
}

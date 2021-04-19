import fs from "fs";
import SONGS from "../src/data/music/songs.json";

const listOfChordsContent = Object.keys(SONGS.chords)
  .sort()
  .reduce((result, chord, index, array) => {
    return (
      result +
      `${chord}${
        array.length - 1 !== index && chord.charAt(0) !== (array[index + 1] || "").charAt(0)
          ? "\n\n"
          : "\n"
      }`
    );
  }, "");

fs.writeFileSync("./src/data/music/songs/listado-de-acordes.txt", listOfChordsContent);

console.log("List of chords page generated");

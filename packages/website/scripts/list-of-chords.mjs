import fs from "fs";
import CHORDS from "../src/lib/guitar/data/chords.json";

const listOfChordsContent = Object.keys(CHORDS)
  .sort()
  .reduce((result, chordName, index, array) => {
    return (
      result +
      `${chordName}${
        array.length - 1 !== index && chordName.charAt(0) !== (array[index + 1] || [])[0]?.charAt(0)
          ? "\n\n"
          : "\n"
      }`
    );
  }, "");

fs.writeFileSync("./src/data/music/songs/listado-de-acordes.txt", listOfChordsContent);

console.log("List of chords page generated");

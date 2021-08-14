import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";

dotenv.config({ path: ".env" });

async function main() {
  const {
    data: { chords },
  } = await axios.get(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/pages/music/data.json`);

  fs.writeFileSync("./src/lib/guitar/data/chords.json", JSON.stringify(chords));

  console.log("Chords file created");
}

main();

import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

async function main() {
  try {
    const {
      data: { chords },
    } = await axios.post(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
      path: "/assets",
      payload: "music",
      source: "firebase",
    });

    fs.writeFileSync("./src/lib/guitar/data/chords.json", chords);

    console.log("Chords file created");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

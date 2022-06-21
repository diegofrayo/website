import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

async function main() {
  try {
    const {
      data: { chords },
    } = await axios.post(`${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`, {
      path: "/data",
      model: "music",
    });

    fs.writeFileSync("./src/lib/guitar/data/chords.json", JSON.stringify(chords));

    console.log("Chords script executed successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

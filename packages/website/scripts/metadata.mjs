import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

const JOB_TITLE = "Software Developer";
const SHORT_NAME = "Diego Rayo";
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const DATA = {
  seo: {
    title: `${SHORT_NAME} | ${JOB_TITLE}`,
    url: WEBSITE_URL,
  },
  website: {
    email: "diegofrayo@gmail.com",
    jobTitle: JOB_TITLE,
    fullName: "Diego Fernando Rayo Zamora",
    shortName: SHORT_NAME,
    url: WEBSITE_URL,
    username: "diegofrayo",
    social: {
      github: "https://www.github.com/diegofrayo",
      linkedin: "https://www.linkedin.com/in/diegofrayo",
      spotify: "https://open.spotify.com/user/225gv7ppksrad4xzfwoyej4iq?si=iITcpGN7RjiwbgTFXy5P6Q",
      "500px": "https://500px.com/p/diegofrayo?view=photos",
    },
  },
};

fs.writeFileSync("./src/data/metadata.json", JSON.stringify(DATA));

console.log("Metadata file created");

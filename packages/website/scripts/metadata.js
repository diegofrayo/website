require("dotenv").config({ path: ".env" });
const fs = require("fs");

const JOB_TITLE = "Software Developer";
const SHORT_NAME = "Diego Rayo";
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
const DATA = {
  SEO_METADATA: {
    title: `${SHORT_NAME} | ${JOB_TITLE}`,
    url: WEBSITE_URL,
  },
  WEBSITE_METADATA: {
    email: "diegofrayo@gmail.com",
    jobTitle: JOB_TITLE,
    fullName: "Diego Fernando Rayo Zamora",
    shortName: SHORT_NAME,
    url: WEBSITE_URL,
    urlProd: "https://diegofrayo.vercel.app",
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

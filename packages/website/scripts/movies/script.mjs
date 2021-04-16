import sharp from "sharp";
import fs from "fs";
import path from "path";

fs.readdirSync(path.resolve(process.cwd(), "public/static/pages/movies/original")).forEach(
  (file) => {
    sharp(path.resolve(process.cwd(), "public/static/pages/movies/original", file))
      .resize(192, 256)
      .toFile(path.resolve(process.cwd(), "public/static/pages/movies", file));
  },
);

console.log("Movies images resized");

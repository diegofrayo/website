import sharp from "sharp";
import fs from "fs";
import path from "path";

fs.readdirSync(path.resolve(process.cwd(), "scripts/movies-and-books/movies")).forEach((file) => {
  sharp(path.resolve(process.cwd(), "scripts/movies-and-books/movies", file))
    .resize(192, 256)
    .toFile(path.resolve(process.cwd(), "public/static/pages/playground/movies", file));
});

fs.readdirSync(path.resolve(process.cwd(), "scripts/movies-and-books/books")).forEach((file) => {
  sharp(path.resolve(process.cwd(), "scripts/movies-and-books/books", file))
    .resize(192, 256)
    .toFile(path.resolve(process.cwd(), "public/static/pages/playground/books", file));
});

console.log("Movies images resized");

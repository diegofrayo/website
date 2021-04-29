import sharp from "sharp";
import fs from "fs";
import path from "path";

resizeImages({
  sourceDir: "scripts/movies-and-books/movies",
  outputDir: "public/static/pages/about-me/movies",
});

resizeImages({
  sourceDir: "scripts/movies-and-books/books",
  outputDir: "public/static/pages/about-me/books",
});

console.log("Movies and books images resized");

// --- Utils ---

function resizeImages({ sourceDir, outputDir }) {
  fs.readdirSync(path.resolve(process.cwd(), sourceDir)).forEach((file) => {
    sharp(path.resolve(process.cwd(), sourceDir, file))
      .resize({ width: 184, height: 256, fit: sharp.fit.fill })
      .toFile(
        path.resolve(
          process.cwd(),
          outputDir,
          file
            .toLowerCase()
            .replace(".gif", ".gif")
            .replace(".jpeg", ".jpg")
            .replace(".png", ".jpg"),
        ),
      );
  });
}

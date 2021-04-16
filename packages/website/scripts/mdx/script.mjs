import fs from "fs";

const input = fs.readFileSync("./scripts/mdx/input.txt", "utf8").toString();

fs.writeFileSync(
  "./scripts/mdx/output.txt",
  replaceAll(replaceAll(replaceAll(input, "`", "\\`"), "\n\n", "\n[BR]\n"), "${", "\\${"),
);

// --- Utils ---

function replaceAll(str, toReplace, replacement) {
  return str.replace(new RegExp(escapeRegExp(toReplace), "g"), replacement);
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

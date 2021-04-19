import path from "path";
import fs from "fs";

import { T_Object } from "~/types";

import { T_Snippet } from "./types";

export function getSnippetsFiles(): T_Object<T_Snippet[]> {
  const tree = createFilesTree(path.resolve(process.cwd(), "src/components/pages/snippets/data"));

  return tree.data;
}

// --- Utils ---

function createFilesTree(directory): T_Object<T_Object<T_Snippet[]>> {
  const files = {};

  fs.readdirSync(directory).forEach((file) => {
    const fileAbsolutePath = path.join(directory, file);
    const fileDirname = path
      .dirname(fileAbsolutePath)
      .substring(path.dirname(fileAbsolutePath).lastIndexOf("/") + 1);

    if (fs.statSync(fileAbsolutePath).isDirectory()) {
      files[fileDirname] = {
        ...files[fileDirname],
        ...createFilesTree(fileAbsolutePath),
      };
    } else {
      const fileExtension = path.extname(fileAbsolutePath);
      const fileName = path.basename(fileAbsolutePath).replace(fileExtension, "");

      if (!files[fileDirname]) files[fileDirname] = [];

      files[fileDirname].push({
        title: fileName,
        content: fs.readFileSync(fileAbsolutePath, "utf8").toString(),
        language: {
          ts: "typescript",
          jsx: "jsx",
          sh: "bash",
          css: "css",
          js: "javascript",
        }[fileExtension.replace(".", "")],
      });
    }
  });

  return files;
}

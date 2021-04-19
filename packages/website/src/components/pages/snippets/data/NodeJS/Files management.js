import fs from "fs";

// check if file exists
fs.existsSync(`${process.cwd()}/src/components/pages/blog/${postSlug}/code.ts`);

// require with dynamic paths
{
  const myVar = myObject.property; // this is required

  // good
  require(`src/components/pages/blog/${myVar}/code.ts`).default;

  // bad
  require(`src/components/pages/blog/${myObject.property}/code.ts`).default;
}
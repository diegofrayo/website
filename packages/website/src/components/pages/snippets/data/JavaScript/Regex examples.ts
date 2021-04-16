function replaceAll(str: string, toReplace: string, replacement: string): string {
  return str.replace(new RegExp(escapeRegExp(toReplace), "g"), replacement);
}

function escapeRegExp(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Example 1
// /^(sm:|md:|lg:|xl:)?(tw-my-|tw-mx-|tw-mt-|tw-mb-)\d{1,2}$/
// ^ => starts with
// (x,y,z) => OR
// ? => optional
// /d{1,2} => numbers one or two digits
// $ => ends

// Example 2
"i have spaces".replace(/ /g, "-"); // output: "i-have-spaces"
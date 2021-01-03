export function capitalize(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((item: string) => (item ? item[0].toUpperCase() + item.substring(1) : ""))
    .join(" ")
    .trim();
}

export function removeEmojiFromTitle(str: string): string {
  return str.split(" ").slice(1).join(" ").trim();
}

export function slugify(str: string): string {
  let result: string = str.replace(/^\s+|\s+$/g, "").toLowerCase();

  // remove accents, swap ñ for n, etc
  const FROM = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const TO = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = FROM.length; i < l; i += 1) {
    result = result.replace(new RegExp(FROM.charAt(i), "g"), TO.charAt(i));
  }

  result = result
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return result;
}

export function toUpperCaseObjectProperty(url: string): string {
  return url.toUpperCase().replace(/-+/g, "_");
}

export function toLowerCaseObjectProperty(url: string): string {
  return url.toLowerCase().replace(/-+/g, "_");
}

import emojiStrip from "emoji-strip";

export function convertToCapitalLetter(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((item: string) => (item ? item[0].toUpperCase() + item.substring(1) : ""))
    .join(" ")
    .trim();
}

export function convertSnakeCaseToLowerCamelCase(str: string): string {
  return str
    .split("_")
    .map((item: string, index: number) => {
      return index === 0 ? item : item[0].toUpperCase() + item.substring(1);
    })
    .join("")
    .trim();
}

export function removeEmojiFromString(str: string): string {
  return emojiStrip(str);
}

export function generateSlug(str: string): string {
  let result: string = str.replace(/^\s+|\s+$/g, "").toLowerCase();

  // remove accents, swap ñ for n, etc
  const FROM = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const TO = "aaaaeeeeiiiioooouuuunc------";

  createArray(FROM.length).forEach((i) => {
    result = result.replace(new RegExp(FROM.charAt(i), "g"), TO.charAt(i));
  });

  result = result
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return result;
}

export function generateObjectKeyInUpperCase(url: string): string {
  return url.toUpperCase().replace(/-+/g, "_");
}

export function generateObjectKeyInLowerCase(url: string): string {
  return url.toLowerCase().replace(/-+/g, "_");
}
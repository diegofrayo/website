import { T_Finger, T_GuitarFret, T_GuitarString } from "./types";

export function parseFinger(finger: string): T_Finger | undefined {
  if (!finger) return undefined;

  return Number(finger) as T_Finger;
}

export function parseFret(fret: string): T_GuitarFret {
  return Number(fret) as T_GuitarFret;
}

export function parseGuitarString(string: string): T_GuitarString {
  return Number(string) as T_GuitarString;
}

export function parseBarre(string: string): T_GuitarString {
  return string.length === 2 ? parseGuitarString(string.charAt(0)) : 6;
}

export function isBarreChord(string: string): boolean {
  return string.includes("x");
}

export function checkFingerValidity(value: T_Finger | undefined): boolean {
  if (!(typeof value === "number" && value >= 1 && value <= 4) && value !== undefined) {
    throw new Error(`Invalid finger (${value}). A finger must be between 1 and 4`);
  }

  return true;
}

export function checkGuitarStringValidity(value: number): boolean {
  if (Number.isNaN(value) || !(value >= 1 || value <= 6)) {
    throw new Error(`Invalid guitar string (${value}). A guitar string must be between 1 and 6`);
  }

  return true;
}

export function checkGuitarFretValidity(value: number): boolean {
  if (Number.isNaN(value) || !(value >= 1 || value <= 16)) {
    throw new Error(`Invalid guitar fret (${value}). A guitar fret must be between 1 and 16`);
  }

  return true;
}

export function checkTablatureSpaceValidity(value: number | "x"): boolean {
  if (
    (typeof value === "string" && value !== "x") ||
    (typeof value === "number" && (Number.isNaN(value) || !(value >= 1 || value <= 10)))
  ) {
    throw new Error(
      `Invalid tablature space (${value}). A tablature space must be between 1 and 10 or should be "x"`,
    );
  }

  return true;
}

export function checkBarreChordValidity(value: number): boolean {
  return checkGuitarStringValidity(value);
}

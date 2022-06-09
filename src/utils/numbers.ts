export function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function betweenUntil(min: number, max: number, exclude: number[]): number {
  const randomNumber = between(min, max);

  if (exclude.includes(randomNumber)) {
    return betweenUntil(min, max, exclude);
  }

  return randomNumber;
}

export function safeCastNumber(input: string, defaultValue = 0): number {
  const number = Number(input);

  if (Number.isNaN(number) || number === Infinity) {
    return defaultValue;
  }

  return number;
}

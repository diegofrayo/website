export function isString(param: any): boolean {
  return typeof param === "string";
}

export function isArray(param: any): boolean {
  return Array.isArray(param);
}

export function isArrayNoEmpty(param: any): boolean {
  return isArray(param) && param.length > 0;
}

export function isNumber(param: any): boolean {
  return typeof param === "number";
}

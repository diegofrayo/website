export function and<G_Types>(
  input: unknown,
  validators: ((input: unknown) => boolean)[],
): input is G_Types {
  return validators.reduce((result: boolean, fn) => {
    return result && fn(input);
  }, true);
}

export function or<G_Types>(
  input: unknown,
  validators: ((input: unknown) => boolean)[],
): input is G_Types {
  return validators.reduce((result: boolean, fn) => {
    if (result) {
      return true;
    }

    return fn(input);
  }, false);
}

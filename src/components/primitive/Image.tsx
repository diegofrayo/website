import * as React from "react";

import { isEmptyString, isNotDefined } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElementNullable } from "~/types";

type T_ImageProps = T_HTMLElementAttributes["img"];

function Image({ src, ...rest }: T_ImageProps): T_ReactElementNullable {
  if (isEmptyString(src) || isNotDefined(src)) {
    console.warn(`<Image />: Invalid src("${src}") prop`);
    return null;
  }

  return (
    <img
      src={src}
      loading="lazy"
      alt="Generic alt text"
      {...rest}
    />
  );
}

export default Image;

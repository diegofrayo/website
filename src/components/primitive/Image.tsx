import * as React from "react";

import { logger } from "~/utils/app";
import { isFalsy } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElementNullable } from "~/types";

export type T_ImagePrimitiveComponent = (
  props: T_HTMLElementAttributes["img"],
) => T_ReactElementNullable;

const Image: T_ImagePrimitiveComponent = function Image({ src, ...rest }) {
  if (isFalsy(src)) {
    logger("WARN", `Invalid src("${src}") prop`);
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
};

export default Image;

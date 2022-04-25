import * as React from "react";

import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_ImageProps = T_HTMLElementAttributes["img"];

function Image({ src, ...rest }: T_ImageProps): T_ReactElement {
  if (!src) {
    console.warn("Image component: src is empty");
    return null;
  }

  return (
    <img
      src={src}
      loading="lazy"
      {...rest}
    />
  );
}

export default Image;

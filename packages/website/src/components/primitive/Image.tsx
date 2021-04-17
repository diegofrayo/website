import React from "react";

import { T_HTMLAttributes, T_ReactElement } from "~/types";

type T_ImageProps = T_HTMLAttributes["img"];

function Image({ src, ...rest }: T_ImageProps): T_ReactElement {
  if (!src) {
    console.warn("Image component: src is empty");
    return null;
  }

  return <img src={src} {...rest} />;
}

export default Image;

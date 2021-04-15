import React from "react";

import { T_HTML_Attributes, T_ReactElement } from "~/types";

type T_ImageProps = T_HTML_Attributes["img"];

function Image({ src, ...rest }: T_ImageProps): T_ReactElement {
  if (!src) {
    console.warn("Image component: src is empty");
    return null;
  }

  return <img src={src} {...rest} />;
}

export default Image;

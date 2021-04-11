import React from "react";

import { T_ReactElement } from "~/types";

type T_Image = JSX.IntrinsicElements["img"];

function Image({ src, ...rest }: T_Image): T_ReactElement {
  if (!src) {
    console.warn("Image component: src is empty");
    return null;
  }

  return <img src={src} {...rest} />;
}

export default Image;

import React from "react";

function Image({ src, ...rest }: Record<string, any>): JSX.Element | null {
  if (!src) {
    console.warn("Image component: src is empty");
    return null;
  }

  return <img src={src} {...rest} />;
}

export default Image;

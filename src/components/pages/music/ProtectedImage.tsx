import React from "react";

import { ImageWithLink } from "~/components/pages/_shared";
import { protectedComponent } from "~/hocs";
import { T_HTMLAttributes, T_ReactElement } from "~/types";

function Image({ src = "", className }: T_HTMLAttributes["img"]): T_ReactElement {
  return <ImageWithLink src={src} className={className} />;
}

export default protectedComponent(Image);

import React from "react";

import { ImageWithLink } from "~/components/pages/_shared";
import { protectedComponent } from "~/hocs";
import { T_HTMLAttributes, T_ReactElement } from "~/types";

function ProtectedImage({ src = "", className, alt }: T_HTMLAttributes["img"]): T_ReactElement {
  return <ImageWithLink src={src} alt={alt} className={className} />;
}

export default protectedComponent(ProtectedImage);

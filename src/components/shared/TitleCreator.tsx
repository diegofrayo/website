import * as React from "react";

import { Title as TitlePrimitive } from "~/components/primitive";
import type {
  T_Object,
  T_ReactChildrenProp,
  T_ReactElement,
  T_ReactFunctionComponent,
} from "~/types";

function TitleCreator(
  Tag: "h1" | "h2" | "h3" | "h4",
  props: T_Object,
): T_ReactFunctionComponent<{ children: T_ReactChildrenProp }> {
  return function TitleComponent({ children }: { children: T_ReactChildrenProp }): T_ReactElement {
    return (
      <TitlePrimitive
        is={Tag}
        {...props}
      >
        {children}
      </TitlePrimitive>
    );
  };
}

export default TitleCreator;

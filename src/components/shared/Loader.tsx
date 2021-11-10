import * as React from "react";

import { Block } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

function Loader(): T_ReactElement {
  return (
    <Block className="dfr-Loader">
      <Block />
      <Block />

      <style jsx>{`
        :global(.dfr-Loader) {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }

        :global(.dfr-Loader) :global(div) {
          @apply dfr-border-color-primary;
          position: absolute;
          border: 4px solid;
          opacity: 1;
          border-radius: 50%;
          animation: root 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }

        :global(.dfr-Loader) :global(div):nth-child(2) {
          animation-delay: -0.5s;
        }

        @keyframes root {
          0% {
            top: 36px;
            left: 36px;
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: 0px;
            left: 0px;
            width: 72px;
            height: 72px;
            opacity: 0;
          }
        }
      `}</style>
    </Block>
  );
}

export default Loader;

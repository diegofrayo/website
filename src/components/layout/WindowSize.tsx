import React, { useState } from "react";

import { Block } from "~/components/primitive";
import { useOnWindowResize } from "~/hooks";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { T_ReactElement, T_WebsiteMetadata } from "~/types";

function WindowSize(): T_ReactElement {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);
  const [size, setSize] = useState([0, 0]);

  useOnWindowResize(function onWindowResize() {
    setSize([window.innerWidth, window.innerHeight]);
  });

  return (
    <Block
      className="dfr-WindowSize tw-cursor-pointer"
      onClick={() => {
        window.open(`${WEBSITE_METADATA.url}${window.location.pathname}`);
      }}
    >
      <span>{size.join("x")} | </span>
      <span className="sm:tw-hidden tw-inline-block">mobile</span>
      <span className="sm:tw-inline-block md:tw-hidden tw-hidden">sm</span>
      <span className="md:tw-inline-block lg:tw-hidden tw-hidden">md</span>
      <span className="lg:tw-inline-block tw-hidden">lg</span>

      <style jsx>
        {`
          :global(.dfr-WindowSize) {
            background-color: rgba(0, 0, 0, 0.5);
            bottom: 0;
            color: white;
            font-weight: bold;
            left: 0;
            padding: 10px;
            position: fixed;
          }
        `}
      </style>
    </Block>
  );
}

export default WindowSize;

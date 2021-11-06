import React from "react";

import { Block, InlineText } from "~/components/primitive";
import { useOnWindowResize } from "~/hooks";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import { T_ReactElement, T_WebsiteMetadata } from "~/types";

function WindowSize(): T_ReactElement {
  const WEBSITE_METADATA = useStoreSelector<T_WebsiteMetadata>(selectWebsiteMetadata);
  const [size, setSize] = React.useState([0, 0]);

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
      <InlineText>{size.join("x")} | </InlineText>
      <InlineText className="sm:tw-hidden tw-inline-block">mobile</InlineText>
      <InlineText className="sm:tw-inline-block md:tw-hidden tw-hidden">sm</InlineText>
      <InlineText className="md:tw-inline-block lg:tw-hidden tw-hidden">md</InlineText>
      <InlineText className="lg:tw-inline-block tw-hidden">lg</InlineText>

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

import * as React from "react";

import { Block, InlineText } from "~/components/primitive";
import { useOnWindowResize } from "~/hooks";
import { useStoreSelector } from "~/state";
import { selectWebsiteMetadata } from "~/state/modules/metadata";
import type { T_ReactElement, T_WebsiteMetadata } from "~/types";

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
      <InlineText className="tw-inline-block sm:tw-hidden">mobile</InlineText>
      <InlineText className="tw-hidden sm:tw-inline-block md:tw-hidden">sm</InlineText>
      <InlineText className="lg:tw-hidden tw-hidden md:tw-inline-block">md</InlineText>
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

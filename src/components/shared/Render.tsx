import * as React from "react";

import { Block, Text, InlineText } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

import Emoji from "./Emoji";
import Loader from "./Loader";

function Render({
  isLoading,
  error,
  data,
  children,
}: {
  isLoading: boolean;
  error: Error | unknown;
  data: unknown;
  children: (data: unknown) => T_ReactElement;
}): T_ReactElement {
  if (isLoading) {
    return (
      <Block className="tw-p-2 tw-text-center">
        <Loader />
      </Block>
    );
  }

  if (error) {
    return (
      <Text className="tw-p-2 tw-text-center tw-text-red-700 tw-text-sm">
        <Emoji className="tw-mr-2">😵</Emoji>
        <InlineText>
          {error instanceof Error ? error.message : (error as string) || "Error"}
        </InlineText>
      </Text>
    );
  }

  return children(data);
}

export default Render;

import * as React from "react";

import { Block, Text, InlineText } from "~/components/primitive";
import type { T_ReactElementNullable } from "~/types";
import { getErrorMessage } from "~/utils/misc";

import Emoji from "./Emoji";
import Loader from "./Loader";

type T_RenderProps = {
  isLoading: boolean;
  error: unknown;
  data: unknown;
  children: (data: unknown) => T_ReactElementNullable;
};

function Render({ isLoading, error, data, children }: T_RenderProps): T_ReactElementNullable {
  if (isLoading) {
    return (
      <Block className="tw-p-2 tw-text-center">
        <Loader />
      </Block>
    );
  }

  if (error) {
    return (
      <Text className="tw-p-2 tw-text-center tw-text-sm dfr-text-colorful-secondary-100">
        <Emoji className="tw-mr-2">😵</Emoji>
        <InlineText>{getErrorMessage(Error)}</InlineText>
      </Text>
    );
  }

  return children(data);
}

export default Render;

import * as React from "react";

import { Block, Text } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

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
        😵 {error instanceof Error ? error.message : error || "Error"}
      </Text>
    );
  }

  return children(data);
}

export default Render;

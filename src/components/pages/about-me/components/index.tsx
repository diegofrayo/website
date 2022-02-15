import classNames from "classnames";
import * as React from "react";

import { Block, Image, InlineText, Text } from "~/components/primitive";

import type { T_ReactElement } from "~/types";

export function AboutMeBlock({
  image,
  text,
  isPortrait,
  layout,
}: {
  image?: string;
  text: string;
  isPortrait: boolean;
  layout?: "R" | "L";
}): T_ReactElement {
  return (
    <Block className="tw-mb-8 tw-overflow-auto">
      <Text>
        {image && (
          <Image
            src={image}
            className={classNames(
              "dfr-border-color-primarytw-border-4  tw-my-1 tw-inline-block tw-rounded-md tw-shadow-md",
              isPortrait ? "tw-w-24" : "tw-h-32 tw-w-40",
              layout === "R" ? "tw-float-right tw-ml-4" : "tw-float-left tw-mr-4",
            )}
          />
        )}
        <InlineText>{text}</InlineText>
      </Text>
    </Block>
  );
}

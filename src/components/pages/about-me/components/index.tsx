import classNames from "classnames";
import * as React from "react";

import { Block, Image, InlineText, Text } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { isNotEmptyString } from "~/utils/validations";

type T_AboutMeBlockProps = {
  image?: string;
  text: string;
  isPortrait: boolean;
  layout?: "R" | "L";
};

export function AboutMeBlock({
  image,
  text,
  isPortrait,
  layout,
}: T_AboutMeBlockProps): T_ReactElement {
  return (
    <Block className="tw-mb-8 tw-overflow-auto tw-text-justify">
      <Text>
        {isNotEmptyString(image) ? (
          <Image
            src={image}
            className={classNames(
              "tw-my-1 tw-inline-block tw-rounded-md tw-border-4 dfr-shadow dfr-transition-opacity dfr-border-color-dark-strong",
              isPortrait ? "tw-w-24" : "tw-h-32 tw-w-40",
              layout === "R" ? "tw-float-right tw-ml-4" : "tw-float-left tw-mr-4",
            )}
          />
        ) : null}
        <InlineText>{text}</InlineText>
      </Text>
    </Block>
  );
}

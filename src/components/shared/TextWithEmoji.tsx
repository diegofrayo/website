import * as React from "react";

import { Block, Text } from "~/components/primitive";
import type { T_ReactChildrenProp, T_ReactElement } from "~/types";

import Emoji from "./Emoji";

type T_TextWithEmojiProps = {
  emoji: string;
  children: T_ReactChildrenProp;
};

function TextWithEmoji({ emoji, children }: T_TextWithEmojiProps): T_ReactElement {
  return (
    <Block className="tw-mb-3 tw-flex tw-flex-nowrap">
      <Emoji className="tw-relative tw--top-0.5 tw-mr-3 tw-h-6 tw-w-6 tw-flex-shrink-0 tw-overflow-hidden tw-text-xl">
        {emoji}
      </Emoji>
      <Text className="tw-flex-1">{children}</Text>
    </Block>
  );
}

export default TextWithEmoji;

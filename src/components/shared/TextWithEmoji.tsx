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
    <Block className="tw-flex tw-flex-nowrap tw-mb-3">
      <Emoji className="tw-text-xl tw-mr-3 tw-w-6 tw-h-6 tw-flex-shrink-0 tw-overflow-hidden tw-relative tw--top-0.5">
        {emoji}
      </Emoji>
      <Text className="tw-flex-1">{children}</Text>
    </Block>
  );
}

export default TextWithEmoji;

import * as React from "react";
import classNames from "classnames";

import { InlineText } from "~/components/primitive";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_EmojiProps = T_HTMLElementAttributes["span"];

function Emoji({ children, className }: T_EmojiProps): T_ReactElement {
  return <InlineText className={classNames("emoji", className)}>{children}</InlineText>;
}

export default Emoji;

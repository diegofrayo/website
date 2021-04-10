import React from "react";

import Code from "./Code";

const Story = (props) => <Code {...props} />;

export default {
  title: "Code",
  component: Code,
  argTypes: {},
};

// --- Stories ---

export const Inline = Story.bind({});
Inline.args = {
  children: "I'm a [Inline] Code",
  variant: Code.variant.INLINE,
};

export const Multiline = Story.bind({});
Multiline.args = {
  children: "I'm a [Multiline] Code",
  variant: Code.variant.MULTILINE,
};

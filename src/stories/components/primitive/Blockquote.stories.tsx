import React from "react";

import Blockquote from "~/components/primitive/Blockquote";

const Story = (props) => <Blockquote {...props} />;

export default {
  title: "Blockquote",
  component: Blockquote,
  argTypes: {},
};

// --- Stories ---

export const Unstyled = Story.bind({});
Unstyled.args = {
  children: "I'm a [unstyled] Blockquote",
  variant: Blockquote.variant.UNSTYLED,
  className: "",
};

export const Styled = Story.bind({});
Styled.args = {
  children: "I'm a [styled] Blockquote",
  variant: Blockquote.variant.STYLED,
};

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
  children: "I'm a [Unstyled] Blockquote",
  variant: Blockquote.variant.UNSTYLED,
  className: "tw-text-red-500",
};

export const Primary = Story.bind({});
Primary.args = {
  children: "I'm a [Primary] Blockquote",
  variant: Blockquote.variant.STYLED,
};

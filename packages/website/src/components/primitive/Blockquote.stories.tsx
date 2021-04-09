import React from "react";

import Blockquote from "./Blockquote";

const Story = props => <Blockquote {...props} />;

export default {
  title: "Blockquote",
  component: Blockquote,
  argTypes: {},
};

// --- Stories ---

export const Default = Story.bind({});
Default.args = {
  children: "I'm a [Default]  Blockquote",
};

export const Unstyled = Story.bind({});
Unstyled.args = {
  children: "I'm a [Unstyled] Blockquote",
  variant: Blockquote.variant.UNSTYLED,
  className: "tw-text-red-300",
};

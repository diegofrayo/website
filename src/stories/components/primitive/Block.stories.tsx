import React from "react";

import Block from "~/components/primitive/Block";

const Story = (props) => <Block {...props} />;

export default {
  title: "Block",
  component: Block,
  argTypes: {},
};

// --- Stories ---

export const Div = Story.bind({});
Div.args = {
  children: "I'm a [div] Block with styles",
  className: "tw-text-red-500",
};

export const Section = Story.bind({});
Section.args = {
  children: "I'm a [section] Block without styles",
  is: "section",
};

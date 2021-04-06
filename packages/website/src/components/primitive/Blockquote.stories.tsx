import React from "react";

import Blockquote from "./Blockquote";

const Story = props => <Blockquote {...props} />;

export const Default = Story.bind({});
Default.args = {
  children: "I'm a Blockquote",
};

export default {
  title: "Blockquote",
  component: Blockquote,
  argTypes: {},
};

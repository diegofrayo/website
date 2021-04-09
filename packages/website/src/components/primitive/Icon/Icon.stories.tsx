import React from "react";

import Icon from "./";

const Story = props => <Icon {...props} />;

export default {
  title: "Icon",
  component: Icon,
  argTypes: {},
};

// --- Stories ---

export const Code = Story.bind({});
Code.args = {
  icon: Icon.icon.CODE,
  size: 32,
};

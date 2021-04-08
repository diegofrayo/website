import React from "react";

import Icon from "./Icon";

const Story = props => <Icon {...props} />;

export default {
  title: "Icon",
  component: Icon,
  argTypes: {},
};

// --- Stories ---

export const YouTube = Story.bind({});
YouTube.args = {
  icon: Icon.icon.YOUTUBE,
};

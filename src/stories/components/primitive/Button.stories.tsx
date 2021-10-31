import React from "react";

import Button from "~/components/primitive/Button";

const Story = (props) => <Button {...props} />;

export default {
  title: "Button",
  component: Button,
  argTypes: {},
};

// --- Stories ---

export const Default = Story.bind({});
Default.args = {
  children: "I'm a [Default] Button",
  className: "tw-bg-black tw-text-white",
  onClick: () => alert("Button clicked!"),
};

export const Disabled = Story.bind({});
Disabled.args = {
  children: "I'm a [Disabled] Button",
  disabled: true,
  onClick: () => alert("Noooo!"),
};

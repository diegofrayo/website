import * as React from "react";

import Button from "~/components/primitive/Button";

const Story = (props) => <Button {...props} />;

export default {
  title: "Button",
  component: Button,
  argTypes: {},
};

// --- Stories ---

export const Unstyled = Story.bind({});
Unstyled.args = {
  children: "I'm a [Unstyled] Button",
  className: "tw-text-red-700",
  onClick: () => alert("Button clicked!"),
};

export const Simple = Story.bind({});
Simple.args = {
  variant: Button.variant.SIMPLE,
  children: "I'm a [Simple] Button (See hover effect)",
  className: "",
  onClick: () => alert("Button clicked!"),
};

export const Default = Story.bind({});
Default.args = {
  variant: Button.variant.DEFAULT,
  children: "I'm a [Default] Button",
  className: "",
  onClick: () => alert("Button clicked!"),
};

export const DefaultWithStyles = Story.bind({});
DefaultWithStyles.args = {
  variant: Button.variant.DEFAULT,
  children: "I'm a [Default] Button and I set 'fontWeight' prop",
  className: "",
  fontWeight: "tw-font-normal",
  onClick: () => alert("Button clicked!"),
};

export const Disabled = Story.bind({});
Disabled.args = {
  variant: Button.variant.DEFAULT,
  children: "I'm a [Disabled] Button",
  disabled: true,
  onClick: () => alert("This event must not be fired!"),
};

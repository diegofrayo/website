import * as React from "react";

import Icon from "~/components/primitive/Icon";

const Story = (props) => <Icon {...props} />;

export default {
  title: "Icon",
  component: Icon,
  argTypes: {},
};

// --- Stories ---

export const Default = Story.bind({});
Default.args = {
  icon: Icon.icon.CODE,
  size: 32,
};

export const WithColor = Story.bind({});
WithColor.args = {
  icon: Icon.icon.ZOOM_IN,
  size: "tw-w-10 tw-h-10 dark:tw-w-16 dark:tw-h-16",
  color: "tw-text-red-400 dark:tw-text-blue-400",
  withDarkModeBackground: true,
  wrapperClassName: "tw-m-1 dark:tw-border",
};

import * as React from "react";

import Title from "~/components/primitive/Title";

const Story = (props) => <Title {...props} />;

export default {
  title: "Title",
  component: Title,
  argTypes: {},
};

// --- Stories ---

export const MarkdownTitle = Story.bind({});
MarkdownTitle.args = {
  children: "I'm a [MarkdownTitle] Title",
  is: "h1",
};

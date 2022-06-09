import * as React from "react";

import Title from "~/components/primitive/Title";

function Story(props) {
  return <Title {...props} />;
}

export default {
  title: "primitive/Title",
  component: Title,
  argTypes: {},
};

// --- Stories ---

export const MarkdownTitle = Story.bind({});
MarkdownTitle.args = {
  children: "I'm a [MarkdownTitle] Title",
  is: "h1",
};

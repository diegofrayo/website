import * as React from "react";

import Code from "~/components/primitive/Code";

const Story = (props) => <Code {...props} />;

export default {
  title: "primitive/Code",
  component: Code,
  argTypes: {},
};

// --- Stories ---

export const Inline = Story.bind({});
Inline.args = {
  children: "I'm a [Inline] Code",
  variant: Code.variant.INLINE,
};

export const Multiline = Story.bind({});
Multiline.args = {
  children: `{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}ß`,
  variant: Code.variant.MULTILINE,
};

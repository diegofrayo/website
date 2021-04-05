import React from "react";
import { Link } from "./";

const Story = props => <Link {...props} />;

// Here we export a variant of the default template passing props
export const Styled = Story.bind({});
Styled.args = {
  children: "I'm a link",
  href: "url",
};

// Here we export the default component that
// will be used by Storybook to show it inside the sidebar
export default {
  title: "Link",
  component: Link,
  argTypes: {},
};

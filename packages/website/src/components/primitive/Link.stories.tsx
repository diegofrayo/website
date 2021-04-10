import React from "react";

import Link from "./Link";

const Story = (props) => <Link {...props} />;

export default {
  title: "Link",
  component: Link,
  argTypes: {},
};

// --- Stories ---

export const Default = Story.bind({});
Default.args = {
  children: "Default link",
  href: "https://www.youtube.com",
};

export const Secondary = Story.bind({});
Secondary.args = {
  children: "Secondary link",
  href: "https://www.youtube.com",
  variant: "SECONDARY",
};

export const Unstyled = Story.bind({});
Unstyled.args = {
  children: "Unstyled link",
  href: "https://www.youtube.com",
  external: false,
  variant: "UNSTYLED",
};

export const WithNextLink = Story.bind({});
WithNextLink.args = {
  children: "WithNextLink link",
  href: "#",
  isNextLink: true,
};

export const WithoutChildren = Story.bind({});
WithoutChildren.args = {
  href: "#",
};

export const WithoutHref = Story.bind({});
WithoutHref.args = {
  children: "WithoutHref",
};

export const PageElementLink = Story.bind({});
PageElementLink.args = {
  children: "PageElementLink",
  href: "#",
  external: true,
};

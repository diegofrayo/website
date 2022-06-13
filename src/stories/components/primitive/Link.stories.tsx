// @ts-nocheck

import * as React from "react";

import Link from "~/components/primitive/Link";

const Story = (props) => <Link {...props} />;

export default {
  title: "primitive/Link",
  component: Link,
  argTypes: {},
};

// --- Stories ---

export const Unstyled = Story.bind({});
Unstyled.args = {
  variant: Link.variant.UNSTYLED,
  children: "Unstyled link (youtube)",
  href: "https://www.youtube.com",
  isExternalLink: true,
};

export const Simple = Story.bind({});
Simple.args = {
  variant: Link.variant.SIMPLE,
  children: "Simple link (google)",
  href: "https://www.google.com",
  isExternalLink: true,
};

export const Primary = Story.bind({});
Primary.args = {
  variant: Link.variant.PRIMARY,
  children: "Primary link (facebook)",
  href: "https://www.facebook.com",
  isExternalLink: true,
};

export const Secondary = Story.bind({});
Secondary.args = {
  variant: Link.variant.SECONDARY,
  children: "Secondary link (twitter)",
  href: "https://www.twitter.com",
  isExternalLink: true,
};

export const SecondaryWithFontWeight = Story.bind({});
Secondary.args = {
  variant: Link.variant.SECONDARY,
  children: "By default is bold, but I set font-thin",
  href: "https://www.twitter.com",
  isExternalLink: true,
  fontWeight: "tw-font-thin",
};

export const WithoutChildren = Story.bind({});
WithoutChildren.args = {
  href: "#",
};

export const WithoutHref = Story.bind({});
WithoutHref.args = {
  children: "WithoutHref",
};

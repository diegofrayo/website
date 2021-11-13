import * as React from "react";

import Block from "~/components/primitive/Block";

const Story = (props) => <Block {...props} />;

export default {
  title: "Block",
  component: Block,
  argTypes: {},
};

// --- Stories ---

export const Div = Story.bind({});
Div.args = {
  children: "I'm a [div] with styles",
  className: "tw-text-red-500",
};

export const Section = Story.bind({});
Section.args = {
  is: "section",
  children: "I'm a [section] without styles",
};

export const Article = Story.bind({});
Article.args = {
  is: "article",
  children: "I'm a [article] and my content is centered",
  className: "tw-h-48 tw-w-48 tw-border",
  align: "CENTER",
  display: "tw-flex",
};

export const Featured = Story.bind({});
Featured.args = {
  is: "div",
  children: "I'm a [div] and my variant is 'FEATURED'",
  variant: "FEATURED",
};

export const Quote = Story.bind({});
Quote.args = {
  is: "div",
  children: "I'm a [div] and my variant is 'QUOTE'",
  variant: "QUOTE",
};

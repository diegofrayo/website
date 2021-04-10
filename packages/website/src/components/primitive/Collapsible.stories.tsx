import React from "react";

import Collapsible from "./Collapsible";

const Story = props => <Collapsible {...props} />;

export default {
  title: "Collapsible",
  component: Collapsible,
  argTypes: {},
};

// --- Stories ---

export const OpenByDefault = Story.bind({});
OpenByDefault.args = {
  children: "I'm a [OpenByDefault] Collapsible",
  title: "This is a title",
  openByDefault: true,
};

export const CloseByDefault = Story.bind({});
CloseByDefault.args = {
  children: "I'm a [CloseByDefault] Collapsible",
  title: "",
  openByDefault: false,
};

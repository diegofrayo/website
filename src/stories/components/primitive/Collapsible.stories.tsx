import * as React from "react";

import Collapsible from "~/components/primitive/Collapsible";

function Story(props) {
  return <Collapsible {...props} />;
}

export default {
  title: "primitive/Collapsible",
  component: Collapsible,
  argTypes: {},
};

// --- Stories ---

export const OpenByDefault = Story.bind({});
OpenByDefault.args = {
  children: "I'm a [OpenByDefault] Collapsible and I have a title",
  title: "This is a title",
  openedByDefault: true,
};

export const CloseByDefault = Story.bind({});
CloseByDefault.args = {
  children: "I'm a [CloseByDefault] Collapsible and I don't have a title",
  title: "",
  openedByDefault: false,
};

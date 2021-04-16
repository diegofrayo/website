import React from "react";

import { List, Link } from "~/components/primitive";
import PlaygroundPageTemplate from "~/components/pages/playground/PlaygroundPageTemplate";
import { useAssets } from "~/hooks";
import { T_ReactElement } from "~/types";

function VRPage(): T_ReactElement {
  return (
    <PlaygroundPageTemplate pageName="virtual-reality">
      <Content />
    </PlaygroundPageTemplate>
  );
}

export default VRPage;

// --- Components ---

function Content(): T_ReactElement {
  const { VR_Assets } = useAssets();

  return (
    <List>
      <List.Item>
        <Link href={VR_Assets.INDEX}>index.html</Link>
      </List.Item>
      <List.Item>
        <Link href={VR_Assets.SNIPPETS}>snippets.md</Link>
      </List.Item>
    </List>
  );
}

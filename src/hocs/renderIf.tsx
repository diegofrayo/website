import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import type { T_ReactElementNullable, T_ReactFunctionComponent } from "~/types";

function renderIf<Props>(WrappedComponent: T_ReactFunctionComponent<Props>): any {
  return (renderIfFn: () => boolean) => {
    function RenderIfComponent(props: Props): T_ReactElementNullable {
      const [renderComponent, setRenderComponent] = React.useState(false);

      useDidMount(() => setRenderComponent(renderIfFn()));

      if (!renderComponent) return null;

      return <WrappedComponent {...props} />;
    }

    RenderIfComponent.displayName = `renderIf(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    return hoistNonReactStatics(RenderIfComponent, WrappedComponent);
  };
}

export default renderIf;

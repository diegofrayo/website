import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { useDidMount } from "~/hooks";
import type { T_ReactElement, T_ReactFunctionComponent } from "~/types";

function renderIf<P>(WrappedComponent: T_ReactFunctionComponent<P>): any {
  return (renderIfFn: () => boolean) => {
    const RenderIfComponent = (props: P): T_ReactElement => {
      const [renderComponent, setRenderComponent] = React.useState(false);

      useDidMount(() => setRenderComponent(renderIfFn()));

      if (!renderComponent) return null;

      return <WrappedComponent {...props} />;
    };

    RenderIfComponent.displayName = `renderIf(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    return hoistNonReactStatics(RenderIfComponent, WrappedComponent);
  };
}

export default renderIf;

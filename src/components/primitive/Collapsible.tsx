import * as React from "react";

import type { T_ReactChildrenProp, T_ReactElement, T_ReactRefObject } from "~/types";

import Block from "./Block";

type T_CollapsibleProps = {
  children: T_ReactChildrenProp;
  title?: string;
  openByDefault?: boolean;
};

function Collapsible(props: T_CollapsibleProps): T_ReactElement {
  const {
    // props
    children,
    title,

    // refs
    containerRef,

    // handlers
    handleToggleClick,
  } = useController(props);

  return (
    <details ref={containerRef}>
      <summary className="tw-font-bold" role="button" onClick={handleToggleClick}>
        {title}
      </summary>
      <Block className="tw-pl-5 tw-mt-2">{children}</Block>
    </details>
  );
}

export default Collapsible;

// --- Controller ---

type T_UseController = {
  children: T_CollapsibleProps["children"];
  title: string;
  handleToggleClick: () => void;
  containerRef: T_ReactRefObject<HTMLDetailsElement>;
};

function useController({
  children,
  title = "",
  openByDefault = false,
}: T_CollapsibleProps): T_UseController {
  const [isCollapsed, setIsCollapsed] = React.useState(openByDefault);
  const containerRef = React.useRef<HTMLDetailsElement>(null);

  React.useEffect(
    function toggleCollapse() {
      if (!containerRef.current) return;

      if (isCollapsed === true) {
        containerRef.current.setAttribute("open", "");
      } else {
        containerRef.current.removeAttribute("open");
      }
    },
    [containerRef, isCollapsed],
  );

  return {
    // props
    children,
    title: title || isCollapsed ? "Hide" : "Show",

    // refs
    containerRef,

    // handlers
    handleToggleClick: () => setIsCollapsed((cv) => !cv),
  };
}

import React, { useState, useEffect, useRef } from "react";

import { T_Function, T_ReactChildrenProp, T_ReactElement, T_ReactRefObject } from "~/types";

type T_CollapsibleProps = {
  children: T_ReactChildrenProp;
  title?: string;
  openByDefault?: boolean;
};

function Collapsible(props: T_CollapsibleProps): T_ReactElement {
  const {
    // props
    children,

    // states
    containerRef,

    // vars
    title,
    toggleIsCollapsed,
  } = useController(props);

  return (
    <details ref={containerRef} data-markdown-block>
      <summary className="tw-font-bold" role="button" onClick={toggleIsCollapsed}>
        {title}
      </summary>
      <div className="tw-pl-5 tw-mt-2">{children}</div>
    </details>
  );
}

export default Collapsible;

// --- Controller ---

type T_UseController = {
  children: T_CollapsibleProps["children"];
  title: string;
  toggleIsCollapsed: T_Function;
  containerRef: T_ReactRefObject<HTMLDetailsElement>;
};

function useController({
  children,
  openByDefault = false,
  title = "",
}: T_CollapsibleProps): T_UseController {
  const [isCollapsed, setIsCollapsed] = useState(openByDefault);
  const containerRef = useRef<HTMLDetailsElement>(null);

  useEffect(
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
    title: title ? title : isCollapsed ? "Hide" : "Show",

    // states
    containerRef,

    // vars
    toggleIsCollapsed: () => setIsCollapsed((cv) => !cv),
  };
}

import React, { useState, useEffect, useRef } from "react";

import { T_Function, T_ReactChildrenProp, T_ReactElement, T_ReactRefObject } from "~/types";

type T_CollapsibleProps = {
  children: T_ReactChildrenProp;
  title?: string;
  openByDefault?: boolean;
};

function Collapsible({ children, ...rest }: T_CollapsibleProps): T_ReactElement {
  const { toggleIsCollapsed, title, containerRef } = useController(rest);

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
  isCollapsed: boolean;
  title: string;
  toggleIsCollapsed: T_Function;
  containerRef: T_ReactRefObject<HTMLDetailsElement>;
};

function useController({
  openByDefault = false,
  title = "",
}: Omit<T_CollapsibleProps, "children">): T_UseController {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(openByDefault);
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
    isCollapsed,
    title: title ? title : isCollapsed ? "Hide" : "Show",
    toggleIsCollapsed: () => setIsCollapsed((cv) => !cv),
    containerRef,
  };
}

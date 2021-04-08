import React, { useState, useEffect, useRef } from "react";

import { TypeReactChildren } from "~/types";

type TypeCollapsible = {
  children: TypeReactChildren;
  title?: string;
  htmlAttrs?: { openByDefault?: boolean };
};

function Collapsible({ children, ...rest }: TypeCollapsible) {
  const { toggleIsCollapsed, title, containerRef } = useController(rest);

  return (
    <details ref={containerRef} data-block>
      <summary className="tw-font-bold" role="button" onClick={toggleIsCollapsed}>
        {title}
      </summary>
      <div className="tw-pl-5 tw-mt-2">{children}</div>
    </details>
  );
}

export default Collapsible;

// --- Controller ---

function useController({ htmlAttrs, title }: Omit<TypeCollapsible, "children">) {
  const [isCollapsed, setIsCollapsed] = useState(htmlAttrs?.openByDefault === true ? true : false);
  const containerRef: any = useRef(undefined);

  useEffect(() => {
    if (!containerRef || !containerRef.current) return;

    if (isCollapsed === true) {
      containerRef?.current.setAttribute("open", "");
    } else {
      containerRef?.current.removeAttribute("open");
    }
  }, [containerRef]);

  return {
    isCollapsed,
    toggleIsCollapsed: () => setIsCollapsed(cv => !cv),
    containerRef,
    title: title ? title : isCollapsed ? "Hide" : "Show",
  };
}

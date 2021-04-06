import React, { useState, useEffect, useRef } from "react";

function Collapsible({
  children,
  title: titleProp,
  htmlAttrs,
}: {
  children: any;
  title?: string;
  htmlAttrs?: { openByDefault?: boolean };
}) {
  const { toggleIsCollapsed, title, containerRef } = useController({
    htmlAttrs,
    title: titleProp,
  });

  return (
    <details ref={containerRef} data-block>
      <summary className="tw-font-bold" role="button" onClick={toggleIsCollapsed}>
        {title}
      </summary>
      <div className="tw-pl-5">{children}</div>
    </details>
  );
}

export default Collapsible;

// --- Controller ---

function useController({ htmlAttrs, title }) {
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

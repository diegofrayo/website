import * as React from "react";

import type { T_HTMLElementAttributes, T_ReactElement, T_ReactRefObject } from "~/types";

import Block from "./Block";

type T_CollapsibleProps = T_HTMLElementAttributes["details"] & {
  title?: string;
  openByDefault?: boolean;
};

function Collapsible(props: T_CollapsibleProps): T_ReactElement {
  const {
    // props
    children,
    title,
    className,

    // refs
    containerRef,

    // handlers
    handleToggleClick,
  } = useController(props);

  return (
    <details className={className} ref={containerRef}>
      <summary className="tw-font-bold" role="button" onClick={handleToggleClick}>
        {title}
      </summary>
      <Block className="tw-pl-5 tw-mt-2">{children}</Block>

      <style jsx>{`
        summary {
          outline: 0;
        }
      `}</style>
    </details>
  );
}

export default Collapsible;

// --- Controller ---

type T_UseController = Pick<T_CollapsibleProps, "children" | "title" | "className"> & {
  containerRef: T_ReactRefObject<HTMLDetailsElement>;
  handleToggleClick: () => void;
};

function useController({
  children,
  title = "",
  openByDefault = false,
  className = "",
}: T_CollapsibleProps): T_UseController {
  const [isCollapsed, setIsCollapsed] = React.useState(openByDefault);
  const containerRef = React.useRef<HTMLDetailsElement>(null);

  React.useEffect(
    function toggleCollapse(): void {
      if (!containerRef.current) return;

      if (isCollapsed) {
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
    className,

    // refs
    containerRef,

    // handlers
    handleToggleClick: () => setIsCollapsed((currentValue) => !currentValue),
  };
}

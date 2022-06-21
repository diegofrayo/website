import * as React from "react";

import { isBoolean, isNull, isNotEmptyString } from "~/utils/validations";
import type { T_HTMLElementAttributes, T_ReactElement, T_ReactRefObject } from "~/types";

import Block from "./Block";

// WARN: False positive
/* eslint-disable react/no-unused-prop-types */
type T_CollapsibleProps = T_HTMLElementAttributes["details"] & {
  title?: string;
  openedByDefault?: boolean;
  opened?: boolean;

  onShowContentHandler?: () => void;
  onHideContentHandler?: () => void;
};

function Collapsible(props: T_CollapsibleProps): T_ReactElement {
  const {
    // props
    children,
    className,

    // states & refs
    containerRef,

    // vars
    computedTitle,

    // handlers
    handleToggleClick,
  } = useController(props);

  return (
    <details
      className={className}
      ref={containerRef}
    >
      <summary
        role="button"
        className="tw-font-bold"
        onClick={handleToggleClick}
      >
        {computedTitle}
      </summary>
      <Block className="tw-mt-2 tw-pl-5">{children}</Block>

      <style jsx>
        {`
          summary {
            outline: 0;
          }
        `}
      </style>
    </details>
  );
}

export default Collapsible;

// --- Controller ---

type T_UseControllerReturn = Pick<T_CollapsibleProps, "children" | "className"> & {
  computedTitle: string;
  containerRef: T_ReactRefObject<HTMLDetailsElement>;
  handleToggleClick: () => void;
};

function useController({
  children,
  title = "",
  openedByDefault = false,
  opened,
  className = "",
  onShowContentHandler = (): void => undefined,
  onHideContentHandler = (): void => undefined,
}: T_CollapsibleProps): T_UseControllerReturn {
  // states & refs
  const [isOpened, setIsOpened] = React.useState(openedByDefault);
  const containerRef = React.useRef<HTMLDetailsElement>(null);

  // effects
  React.useEffect(() => {
    if (isNull(containerRef.current)) {
      return;
    }

    if (isOpened) {
      containerRef.current.setAttribute("open", "");
      onShowContentHandler();
    } else {
      containerRef.current.removeAttribute("open");
      onHideContentHandler();
    }
  }, [containerRef, isOpened, onHideContentHandler, onShowContentHandler]);

  React.useEffect(() => {
    if (isBoolean(opened)) {
      setIsOpened(opened);
    }
  }, [opened]);

  return {
    // props
    children,
    className,

    // states & refs
    containerRef,

    // vars
    computedTitle: isNotEmptyString(title) ? title : isOpened ? "Hide" : "Show",

    // handlers
    handleToggleClick: () => setIsOpened((currentValue) => !currentValue),
  };
}

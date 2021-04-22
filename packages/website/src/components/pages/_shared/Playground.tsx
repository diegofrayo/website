import React, { useState, useRef } from "react";
import classNames from "classnames";

import { Button } from "~/components/primitive";
import {
  T_CodeProps,
  T_Function,
  T_ReactElement,
  T_ReactFunctionComponent,
  T_ReactRefObject,
} from "~/types";

import Code from "./Code";

type T_PlaygroundProps = Pick<T_CodeProps, "code" | "language"> & {
  Component: T_ReactFunctionComponent;
};

function Playground(props: T_PlaygroundProps): T_ReactElement {
  const {
    // props
    Component,
    code,
    language,

    // states
    contentRef,
    setSourceCodeTab,
    setOutputTab,

    // utils
    isSourceCodeTabSelected,
    isOutputTabSelected,
  } = useController(props);

  return (
    <div
      className="root tw-flex tw-flex-col tw-border-4 tw-border-black dark:tw-border-white"
      style={{ minHeight: 200 }}
      data-markdown-block
    >
      <div
        className="tw-flex-1 tw-overflow-auto tw-p-0.5"
        style={{ maxHeight: 300 }}
        ref={contentRef}
      >
        {isSourceCodeTabSelected ? (
          <Code language={language} code={code} showOnlySourceCode />
        ) : (
          <Component />
        )}
      </div>
      <div className="tw-flex tw-flex-no-wrap tw-text-sm tw-border-t-4 tw-border-black dark:tw-border-white">
        <Button
          className={classNames(
            "tw-flex-1 tw-text-center tw-cursor-pointer tw-p-2 tw-font-thin",
            isSourceCodeTabSelected &&
              "tw-font-bold tw-bg-black dark:tw-bg-white tw-text-white dark:tw-text-black hover:tw-opacity-100 tw-uppercase",
          )}
          onClick={setSourceCodeTab}
        >
          Source Code
        </Button>
        <Button
          className={classNames(
            "tw-flex-1 tw-text-center tw-cursor-pointer tw-p-2 tw-font-thin",
            isOutputTabSelected &&
              "tw-font-bold tw-bg-black dark:tw-bg-white tw-text-white dark:tw-text-black hover:tw-opacity-100 tw-uppercase",
          )}
          onClick={setOutputTab}
        >
          Output
        </Button>
      </div>

      <style jsx>{`
        .root :global(.dfr-Code) {
          box-shadow: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default Playground;

// --- Controller ---

function useController(
  props: T_PlaygroundProps,
): T_PlaygroundProps & {
  isSourceCodeTabSelected: boolean;
  isOutputTabSelected: boolean;
  setSourceCodeTab: T_Function;
  setOutputTab: T_Function;
  contentRef: T_ReactRefObject<HTMLDivElement>;
} {
  const [tab, setTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  function setSourceCodeTab() {
    setTab(0);

    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }

  function setOutputTab() {
    setTab(1);

    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }

  return {
    // props
    ...props,

    // states
    contentRef,
    setSourceCodeTab,
    setOutputTab,

    // utils
    isSourceCodeTabSelected: tab === 0,
    isOutputTabSelected: tab === 1,
  };
}

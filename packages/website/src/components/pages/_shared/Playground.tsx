import React, { useState } from "react";
import classNames from "classnames";

import { TypeCodeProps } from "~/types";

import Code from "./Code";

type TypePlaygroundProps = {
  Component: any;
  code: TypeCodeProps["code"];
  language: TypeCodeProps["language"];
};

function Playground({ Component, code, language }: TypePlaygroundProps) {
  const [tab, setTab] = useState(0);

  return (
    <div className="root tw-flex tw-flex-col" data-markdown-block>
      <div className="content tw-flex-1 tw-p-2 tw-border-t tw-border-l tw-border-r dfr-border-color-primary dark:dfr-border-color-primary">
        {tab === 0 ? <Code language={language} code={code} /> : <Component />}
      </div>
      <div className="tw-flex tw-flex-no-wrap tw-text-sm">
        <div
          className={classNames(
            "tw-border dfr-border-color-primary dark:dfr-border-color-primary tw-flex-1 tw-text-center tw-cursor-pointer tw-p-1",
            tab === 0 && "tw-font-bold dfr-bg-secondary dark:dfr-bg-secondary",
          )}
          onClick={() => {
            setTab(0);
          }}
          role="button"
        >
          Source Code
        </div>
        <div
          className={classNames(
            "tw-border dfr-border-color-primary dark:dfr-border-color-primary tw-flex-1 tw-text-center tw-cursor-pointer tw-p-1",
            tab === 1 && "tw-font-bold dfr-bg-secondary dark:dfr-bg-secondary",
          )}
          onClick={() => {
            setTab(1);
          }}
          role="button"
        >
          Output
        </div>
      </div>

      <style jsx>{`
        .root {
          min-height: 200px;
        }

        .content {
          max-height: 300px;
          overflow: auto;
        }

        .root :global(.dfr-Code) {
          border: 0;
        }
      `}</style>
    </div>
  );
}

export default Playground;

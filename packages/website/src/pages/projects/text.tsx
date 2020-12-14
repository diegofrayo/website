import React, { useState } from "react";

import { Page } from "~/components";
import { capitalize, copyToClipboard } from "~/utils/misc";

function TextPage(): any {
  const [texts, setTexts] = useState({
    input: "",
    upper: "",
    lower: "",
    capitalize: "",
    capitalizeOnlyFirst: "",
  });

  function handleTextAreaChange(e) {
    const value = e.currentTarget.value || "";

    setTexts({
      input: value,
      upper: value.toUpperCase(),
      lower: value.toLowerCase(),
      capitalize: capitalize(value),
      capitalizeOnlyFirst: value ? value[0].toUpperCase() + value.substring(1) : "",
    });
  }

  function handleCopyText(e) {
    copyToClipboard(e);
  }

  return (
    <Page metadata={{ title: "Text transform tool", noRobots: true }}>
      <section className="twc-max-w-base tw-mx-auto tw-w-full tw-h-full tw-p-6 tw-overflow-auto">
        <section className="tw-mb-8">
          <h1 className="tw-bg-gray-700 tw-text-white tw-text-center tw-p-2">
            type your text
          </h1>
          <textarea
            className="tw-border tw-border-gray-200 tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.input}
            onChange={handleTextAreaChange}
          />
        </section>

        <section className="tw-my-4">
          <p className="tw-font-bold tw-uppercase">uppercase</p>
          <textarea
            className="tw-uppercase tw-my-1 tw-border tw-border-gray-200 tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.upper}
            readOnly
          ></textarea>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.upper}
            onClick={handleCopyText}
          >
            copy
          </button>
        </section>

        <section className="tw-my-4">
          <p className="tw-font-bold tw-lowercase">lowercase</p>
          <textarea
            className="tw-lowercase tw-my-1 tw-border tw-border-gray-200 tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.lower}
            readOnly
          ></textarea>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.lower}
            onClick={handleCopyText}
          >
            copy
          </button>
        </section>

        <section className="tw-my-4">
          <p className="tw-font-bold tw-capitalize">capitalize</p>
          <textarea
            className="tw-capitalize tw-my-1 tw-border tw-border-gray-200 tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.capitalize}
            readOnly
          ></textarea>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.capitalize}
            onClick={handleCopyText}
          >
            copy
          </button>
        </section>

        <section className="tw-my-4">
          <p className="tw-font-bold">Capitalize only first word</p>
          <textarea
            className="tw-my-1 tw-border tw-border-gray-200 tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.capitalizeOnlyFirst}
            readOnly
          ></textarea>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.capitalizeOnlyFirst}
            onClick={handleCopyText}
          >
            copy
          </button>
        </section>
      </section>

      <style jsx>
        {`
          textarea {
            min-height: 50px;
          }
        `}
      </style>
    </Page>
  );
}

export default TextPage;

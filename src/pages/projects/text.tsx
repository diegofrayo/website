import React, { useState } from "react";

import { MainLayout, Page } from "~/components";
import { getSiteTexts } from "~/i18n";
import { Routes } from "~/utils/constants";
import { capitalize, copyToClipboard, slugify } from "~/utils/misc";

const SiteTexts = getSiteTexts({ layout: true });

function TextPage(): any {
  const [texts, setTexts] = useState({
    input: "",
    upper: "",
    lower: "",
    capitalize: "",
    capitalizeOnlyFirst: "",
    slug: "",
  });

  function handleTextAreaChange(e) {
    const value = e.currentTarget.value || "";

    setTexts({
      input: value,
      slug: slugify(value),
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
    <Page metadata={{ title: "text", noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.breadcumb.home, url: Routes.HOME },
          { text: SiteTexts.layout.breadcumb.projects, url: Routes.PROJECTS() },
          {
            text: "text",
            url: Routes.PROJECTS("text"),
          },
        ]}
        title={"text"}
      >
        <section className="tw-mb-8">
          <h2 className="tw-bg-gray-700 tw-text-white tw-text-center tw-p-2">
            type your text
          </h2>
          <textarea
            className="tw-border twc-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.input}
            onChange={handleTextAreaChange}
          />
        </section>

        <section className="tw-my-4">
          <p className="tw-font-bold">slug</p>
          <textarea
            className="tw-my-1 tw-border twc-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.slug}
            readOnly
          />
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.slug}
            onClick={handleCopyText}
          >
            copy
          </button>
        </section>

        <section className="tw-my-4">
          <p className="tw-font-bold tw-uppercase">uppercase</p>
          <textarea
            className="tw-uppercase tw-my-1 tw-border twc-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.upper}
            readOnly
          />
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
            className="tw-lowercase dark:tw-border-0 tw-my-1 tw-border tw-border-gray-200 tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.lower}
            readOnly
          />
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
            className="tw-capitalize tw-my-1 tw-border twc-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.capitalize}
            readOnly
          />
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
            className="tw-my-1 tw-border twc-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full"
            value={texts.capitalizeOnlyFirst}
            readOnly
          />
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.capitalizeOnlyFirst}
            onClick={handleCopyText}
          >
            copy
          </button>
        </section>
      </MainLayout>

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

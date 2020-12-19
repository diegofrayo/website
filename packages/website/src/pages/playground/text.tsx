import React, { useState, useRef } from "react";

import { MainLayout, Page, Separator } from "~/components";
import { useDidMount } from "~/hooks";
import { Routes } from "~/utils/constants";
import { getSiteTexts } from "~/utils/i18n";
import { capitalize, copyToClipboard, slugify } from "~/utils/misc";

const SiteTexts = getSiteTexts({ layout: true });

function TextPage(): any {
  const [texts, setTexts] = useState({
    upper: "",
    lower: "",
    capitalize: "",
    capitalizeOnlyFirst: "",
    slug: "",
  });
  const textareaRef = useRef(null);

  useDidMount(() => {
    textareaRef.current.focus();
    textareaRef.current.click();
  });

  function handleTextAreaChange(e) {
    const text = e.currentTarget.value || "";

    setTexts({
      slug: slugify(text),
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      capitalize: capitalize(text),
      capitalizeOnlyFirst: text ? text[0].toUpperCase() + text.substring(1) : "",
    });
  }

  function handleCopyText(e) {
    copyToClipboard(e);
  }

  return (
    <Page metadata={{ title: "text", noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND(),
          },
          {
            text: "text",
            url: Routes.PLAYGROUND("text"),
          },
        ]}
        title="text"
      >
        <section>
          <p className="tw-font-bold tw-mb-1">type your text</p>
          <textarea
            className="tw-border tw-border-b-4 twc-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full tw-rounded-md"
            ref={textareaRef}
            onChange={handleTextAreaChange}
          />
        </section>

        <Separator size={10} className="tw-border-t twc-border-color-primary" />

        <section className="tw-mb-4">
          <p className="tw-font-bold">slug</p>
          <p className="output tw-border twc-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.slug}
          </p>
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
          <p className="output tw-border twc-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.upper}
          </p>
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
          <p className="output tw-border twc-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.lower}
          </p>
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
          <p className="output tw-border twc-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.capitalize}
          </p>
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
          <p className="output tw-border twc-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.capitalizeOnlyFirst}
          </p>
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

          .output {
            min-height: 40px;
          }
        `}
      </style>
    </Page>
  );
}

export default TextPage;

import React, { useState, useRef } from "react";

import { Page, MainLayout } from "~/components/layout";
import { Separator } from "~/components/primitive";
import Routes from "~/data/routes.json";
import { useDidMount } from "~/hooks";
import { TypeSiteTexts, TypePagesRoutes } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";
import { convertToCapitalLetter, generateSlug } from "~/utils/strings";

const SiteTexts: TypeSiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "strings";

function StringsPage(): any {
  const [texts, setTexts] = useState({
    input: "",
    upper: "",
    lower: "",
    convertToCapitalLetter: "",
    convertToCapitalLetterOnlyFirst: "",
    slug: "",
  });
  const textareaRef: { current: undefined | any } = useRef(undefined);

  useDidMount(() => {
    textareaRef.current.focus();
    textareaRef.current.click();
  });

  function handleTextAreaChange(event) {
    const text = event.currentTarget.value || "";

    setTexts({
      input: text,
      slug: generateSlug(text),
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      convertToCapitalLetter: convertToCapitalLetter(text),
      convertToCapitalLetterOnlyFirst: text
        ? text[0].toUpperCase() + text.substring(1)
        : "",
    });
  }

  function handleCopyText(error) {
    copyToClipboard(error);
  }

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME as TypePagesRoutes,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND as TypePagesRoutes,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <div>
          <p className="tw-font-bold tw-mb-1">type your text</p>
          <textarea
            className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-3 tw-resize-none tw-w-full tw-rounded-md"
            ref={textareaRef}
            onChange={handleTextAreaChange}
            onClick={e => {
              try {
                e.currentTarget.focus();
                e.currentTarget.select();
              } catch (error) {
                console.error(error);
              }
            }}
          />
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.input}
            onClick={handleCopyText}
          >
            copy
          </button>
        </div>

        <Separator size={10} className="tw-border-t dfr-border-color-primary" />

        <div className="tw-mb-4">
          <p className="tw-font-bold">slug</p>
          <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.slug}
          </output>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.slug}
            onClick={handleCopyText}
          >
            copy
          </button>
        </div>

        <div className="tw-my-4">
          <p className="tw-font-bold tw-uppercase">uppercase</p>
          <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.upper}
          </output>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.upper}
            onClick={handleCopyText}
          >
            copy
          </button>
        </div>

        <div className="tw-my-4">
          <p className="tw-font-bold tw-lowercase">lowercase</p>
          <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.lower}
          </output>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.lower}
            onClick={handleCopyText}
          >
            copy
          </button>
        </div>

        <div className="tw-my-4">
          <p className="tw-font-bold tw-capitalize">capital letter</p>
          <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.convertToCapitalLetter}
          </output>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.convertToCapitalLetter}
            onClick={handleCopyText}
          >
            copy
          </button>
        </div>

        <div className="tw-my-4">
          <p className="tw-font-bold">Upper case only the first word</p>
          <output className="output tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full tw-my-1">
            {texts.convertToCapitalLetterOnlyFirst}
          </output>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={texts.convertToCapitalLetterOnlyFirst}
            onClick={handleCopyText}
          >
            copy
          </button>
        </div>
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

export default StringsPage;

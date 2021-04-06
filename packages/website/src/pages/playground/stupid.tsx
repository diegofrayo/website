import React, { useState, useRef } from "react";

import { Page, MainLayout } from "~/components/layout";
import { Space } from "~/components/primitive";
import { Routes } from "~/utils/routing";
import { useDidMount } from "~/hooks";
import { TypeSiteTexts } from "~/types";
import { copyToClipboard } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts: TypeSiteTexts = getSiteTexts({ layout: true });
const MY_STUPID_SECRET_KEY = "MY_STUPID_SECRET_KEY";
const PAGE_NAME = "stupid";

function StupidPage(): any {
  const [output, setOutput] = useState("");
  const inputRef: { current: undefined | any } = useRef(undefined);

  useDidMount(() => {
    inputRef.current.focus();
    inputRef.current.click();
  });

  async function handleEncrypt() {
    const CryptoJS = await import("crypto-js");

    const encryptedText = CryptoJS.AES.encrypt(
      inputRef.current.value,
      MY_STUPID_SECRET_KEY,
    ).toString();

    setOutput(encryptedText);
  }

  async function handleDecrypt() {
    const CryptoJS = await import("crypto-js");

    const decryptedText = CryptoJS.AES.decrypt(
      inputRef.current.value,
      MY_STUPID_SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);

    setOutput(decryptedText || "Error, the text was not decrypted :(");
  }

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: Routes.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <div className="tw-mb-8">
          <label htmlFor="input">
            <p className="tw-font-bold tw-cursor-pointer">type your text</p>
            <input
              id="input"
              className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              ref={inputRef}
              onClick={e => {
                try {
                  e.currentTarget.focus();
                  e.currentTarget.select();
                } catch (error) {
                  console.error("Error focussing a textarea");
                  console.error(error);
                }
              }}
            />
          </label>
          <div className="tw-flex tw-flex-wrap tw-justify-between">
            <button
              type="button"
              className="tw-inline-block tw-text-sm tw-mx-1 tw-font-bold"
              onClick={handleEncrypt}
            >
              encrypt
            </button>
            <button
              type="button"
              className="tw-inline-block tw-text-sm tw-mx-1 tw-font-bold"
              onClick={handleDecrypt}
            >
              decrypt
            </button>
          </div>
        </div>

        <Space size={10} className="tw-border-t dfr-border-color-primary" />

        <div>
          <p className="tw-font-bold">output</p>
          <output className="output tw-my-1 tw-border dfr-border-color-primary tw-block tw-p-3 tw-w-full">
            {output}
          </output>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={output}
            onClick={copyToClipboard}
          >
            copy
          </button>
        </div>

        <style jsx>
          {`
            .output {
              min-height: 40px;
            }
          `}
        </style>
      </MainLayout>
    </Page>
  );
}

export default StupidPage;

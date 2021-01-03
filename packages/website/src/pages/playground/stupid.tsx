import React, { useState, useRef } from "react";

import { MainLayout, Page, Separator } from "~/components";
import Routes from "~/data/routes.json";
import { useDidMount } from "~/hooks";
import { copyToClipboard } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts = getSiteTexts({ layout: true });
const MY_STUPID_SECRET_KEY = "MY_STUPID_SECRET_KEY";
const PAGE_NAME = "stupid";

function StupidPage(): any {
  const [output, setOutput] = useState("");
  const inputRef = useRef(null);

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

  function handleCopyText(e) {
    copyToClipboard(e);
  }

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          { text: SiteTexts.layout.current_locale.breadcumb.home, url: Routes.HOME },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: Routes.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
            url: Routes.PLAYGROUND_PROJECTS[PAGE_NAME],
          },
        ]}
        title={PAGE_NAME}
      >
        <section className="tw-mb-8">
          <label htmlFor="input">
            <p className="tw-font-bold tw-cursor-pointer">type your text</p>
            <input
              id="input"
              className="tw-border tw-border-b-4 twc-border-color-primary tw-block tw-p-2 tw-w-full tw-my-1 tw-rounded-md"
              ref={inputRef}
              onClick={e => {
                try {
                  e.currentTarget.focus();
                  e.currentTarget.select();
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          </label>
          <section className="tw-flex tw-flex-wrap tw-justify-between">
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
          </section>
        </section>

        <Separator size={10} className="tw-border-t twc-border-color-primary" />

        <section>
          <p className="tw-font-bold">output</p>
          <p className="output tw-my-1 tw-border twc-border-color-primary tw-block tw-p-3 tw-w-full">
            {output}
          </p>
          <button
            type="button"
            className="tw-block tw-ml-auto tw-text-sm"
            data-clipboard-text={output}
            onClick={handleCopyText}
          >
            copy
          </button>
        </section>

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

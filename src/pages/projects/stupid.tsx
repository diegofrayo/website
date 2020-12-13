import React, { useState, useRef } from "react";
import CryptoJS from "crypto-js";

import { Page } from "~/components";
import { copyToClipboard } from "~/utils/misc";

const MY_STUPID_SECRET_KEY = "MY_STUPID_SECRET_KEY";

function PasswordsPage(): any {
  const [output, setOutput] = useState("");
  const inputRef = useRef(null);

  function handleEncrypt() {
    const encryptedText = CryptoJS.AES.encrypt(
      inputRef.current.value,
      MY_STUPID_SECRET_KEY,
    ).toString();

    setOutput(encryptedText);
  }

  function handleDecrypt() {
    const decryptedText = CryptoJS.AES.decrypt(
      inputRef.current.value,
      MY_STUPID_SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);

    setOutput(decryptedText);
  }

  function handleCopyText(e) {
    copyToClipboard(e);
  }

  return (
    <Page metadata={{ title: "Stupid tool", noRobots: true }}>
      <section className="twc-max-w-base tw-mx-auto tw-w-full tw-h-full tw-p-6 tw-overflow-auto">
        <section className="tw-mb-8">
          <h1 className="tw-bg-gray-700 tw-text-white tw-text-center tw-p-2">
            stupid tool
          </h1>
          <input
            id="input"
            className="tw-border tw-border-gray-200 tw-block tw-p-2 tw-w-full"
            ref={inputRef}
          />
          <section className="tw-flex tw-flex-wrap tw-justify-between tw-py-1">
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

        <section className="tw-my-4">
          <p className="tw-font-bold tw-uppercase">output</p>
          <p className="tw-my-1 tw-border tw-border-gray-200 tw-block tw-p-3 tw-w-full">
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
      </section>
    </Page>
  );
}

export default PasswordsPage;

import React, { useState, useRef } from "react";

import { Icon, Link } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { focusElement, isSmallScreen } from "~/utils/browser";

function WhatsApp(): T_ReactElement {
  const [phone, setPhone] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useDidMount(() => {
    if (isSmallScreen() || !inputRef.current) return;
    focusElement(inputRef.current);
  });

  const isInvalidPhone = !inputRef?.current?.validity?.valid || !phone;

  return (
    <div className="tw-flex tw-flex-no-wrap tw-items-end">
      <label className="tw-flex-1 tw-mr-2" htmlFor="input">
        <p className="tw-font-bold tw-cursor-pointer">type a phone number</p>
        <input
          id="input"
          className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-mt-1 tw-rounded-md"
          ref={inputRef}
          value={phone}
          placeholder="+57"
          pattern="[0-9]{10}"
          onChange={(e) => setPhone(e.currentTarget.value)}
          onKeyPress={(e) => {
            if (e.key !== "Enter" || isInvalidPhone) return;
            document.getElementById("btn")?.click();
          }}
        />
      </label>
      <Link
        role="button"
        className="tw-self-end tw-flex"
        href={`https://api.whatsapp.com/send?phone=57${phone}`}
        variant={Link.variant.SIMPLE}
        disabled={isInvalidPhone}
        id="btn"
      >
        <Icon icon={Icon.icon.WHATSAPP} size={48} />
      </Link>
    </div>
  );
}

export default WhatsApp;

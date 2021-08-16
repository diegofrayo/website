import React, { useState, useRef, useEffect } from "react";

import { Icon, Link } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { focusElement, isSmallScreen } from "~/utils/browser";
import { generateSlug, replaceAll } from "~/utils/strings";

function WhatsApp(): T_ReactElement {
  const {
    // states
    phone,
    inputRef,
    isInvalidPhone,

    // handlers
    onKeyPress,
    onChange,
  } = useController();

  return (
    <div className="tw-flex tw-flex-no-wrap tw-items-end">
      <label className="tw-flex-1 tw-mr-2" htmlFor="input">
        <p className="tw-font-bold tw-cursor-pointer">Ingrese un número de celular</p>
        <input
          id="input"
          className="tw-border tw-border-b-4 dfr-border-color-primary tw-block tw-p-2 tw-w-full tw-mt-1 tw-rounded-md"
          ref={inputRef}
          value={phone}
          placeholder="🇨🇴 +57"
          pattern="[0-9]{10}"
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </label>
      <Link
        role="button"
        id="button"
        className="tw-self-end tw-flex"
        href={`https://api.whatsapp.com/send?phone=57${phone}`}
        variant={Link.variant.SIMPLE}
        disabled={isInvalidPhone}
      >
        <Icon icon={Icon.icon.WHATSAPP} size={48} />
      </Link>
    </div>
  );
}

export default WhatsApp;

// --- Controller ---

function useController(): {
  phone: string;
  inputRef: any;
  onKeyPress: any;
  onChange: any;
  isInvalidPhone: boolean;
} {
  const [phone, setPhone] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInvalidPhone, setIsInvalidPhone] = useState(true);

  useDidMount(() => {
    if (isSmallScreen() || !inputRef.current) return;
    focusElement(inputRef.current);
  });

  useEffect(() => {
    setIsInvalidPhone(!inputRef?.current?.validity?.valid || !phone);
  }, [phone]);

  function onKeyPress(e) {
    if (e.key !== "Enter" || isInvalidPhone) return;
    document.getElementById("button")?.click();
  }

  function onChange(e) {
    setPhone(replaceAll(generateSlug(e.currentTarget.value), "-", ""));
  }

  return {
    // states
    phone,
    inputRef,
    isInvalidPhone,

    // handlers
    onKeyPress,
    onChange,
  };
}

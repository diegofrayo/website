import React, { useState, useRef, useEffect } from "react";

import { Icon, Input, Link } from "~/components/primitive";
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
    isWebOptionSelected,

    // handlers
    onKeyPress,
    onChange,
    onRadioChange,
  } = useController();

  return (
    <div>
      <div className="tw-flex tw-flex-no-wrap tw-items-end">
        <Input
          id="input"
          label="Ingrese un número de celular"
          labelProps={{ className: "tw-flex-1 tw-mr-2" }}
          ref={inputRef}
          value={phone}
          placeholder="🇨🇴 +57"
          pattern="[0-9]{10}"
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
        <Link
          role="button"
          id="button"
          className="tw-self-end tw-flex"
          href={`https://${isWebOptionSelected ? "web" : "api"}.whatsapp.com/send?phone=57${phone}`}
          variant={Link.variant.SIMPLE}
          disabled={isInvalidPhone}
        >
          <Icon icon={Icon.icon.WHATSAPP} size={48} />
        </Link>
      </div>
      <div className="tw-flex tw-mt-1 tw-justify-between tw-pr-14">
        <div>
          <input
            type="radio"
            className="tw-mr-1"
            id="radio-web"
            name="option"
            value="web"
            checked={isWebOptionSelected}
            onChange={onRadioChange}
          />
          <label htmlFor="radio-web">web</label>
        </div>
        <div>
          <input
            type="radio"
            className="tw-mr-1"
            id="radio-app"
            name="option"
            value="app"
            checked={!isWebOptionSelected}
            onChange={onRadioChange}
          />
          <label htmlFor="radio-app">app</label>
        </div>
      </div>
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
  onRadioChange: any;
  isInvalidPhone: boolean;
  isWebOptionSelected: boolean;
} {
  const [phone, setPhone] = useState("");
  const [isWebOptionSelected, setIsWebOptionSelected] = useState(true);
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

  function onRadioChange(e) {
    setIsWebOptionSelected(e.currentTarget.value === "web");
  }

  return {
    // states
    phone,
    inputRef,
    isInvalidPhone,
    isWebOptionSelected,

    // handlers
    onKeyPress,
    onChange,
    onRadioChange,
  };
}

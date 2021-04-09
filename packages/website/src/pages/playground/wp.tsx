import React, { useState, useRef } from "react";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Link } from "~/components/primitive";
import { Routes } from "~/utils/routing";
import { useDidMount } from "~/hooks";
import { T_SiteTexts } from "~/types";
import { focusElement, isSmallScreen } from "~/utils/browser";
import { getSiteTexts } from "~/utils/internationalization";

const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "wp";

function WPPage(): any {
  const [phone, setPhone] = useState("");
  const inputRef: { current: undefined | any } = useRef(undefined);

  useDidMount(() => {
    if (isSmallScreen()) return;
    focusElement(inputRef.current);
  });

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
              onChange={e => setPhone(e.currentTarget.value)}
            />
          </label>
          <Link
            role="button"
            className="tw-self-end tw-flex"
            href={`https://api.whatsapp.com/send?phone=57${phone}`}
            variant={Link.variant.UNSTYLED}
            disabled={!inputRef?.current?.validity?.valid || !phone}
          >
            <Icon icon={Icon.icon.WHATSAPP} size={48} />
          </Link>
        </div>
      </MainLayout>
    </Page>
  );
}

export default WPPage;

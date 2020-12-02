import * as React from "react";

import { Page } from "~/components/layout";

function AboutMe(): any {
  return (
    <Page>
      <div className="tw-flex tw-flex-col tw-h-full">
        <section className="tw-mx-auto tw-max-w-screen-md tw-w-full tw-flex-1 tw-overflow-auto tw-p-6">
          <h1 className="tw-text-left tw-text-3xl tw-text-gray-900 tw-mb-8">
            En construcción... 🚧
          </h1>
        </section>
      </div>
    </Page>
  );
}

export default AboutMe;

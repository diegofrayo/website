import * as React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Page, MainLayout } from "~/components/layout";
import { MDXContent } from "~/components/shared";
import type { T_ReactElement } from "~/types";
import { isMobileiOS } from "~/utils/browser";
import { isBrowser } from "~/utils/misc";
import { replaceAll } from "~/utils/strings";

function Contacts({ mdxOutput }: { mdxOutput: MDXRemoteSerializeResult }): T_ReactElement {
  const PAGE_TITLE = "Contacts";

  if (!isBrowser()) return null;

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        <MDXContent
          content={
            !isMobileiOS()
              ? {
                  ...mdxOutput,
                  compiledSource: replaceAll(mdxOutput.compiledSource, "api.", "web."),
                }
              : mdxOutput
          }
        />
      </MainLayout>
    </Page>
  );
}

export default Contacts;

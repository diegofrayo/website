import * as React from "react";

import { Link, List, Title, Block } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import { generateSlug } from "~/utils/strings";
import type { T_ReactElement } from "~/types";

function Sources({ sources }: { sources: { title: string; url: string }[] }): T_ReactElement {
  // hooks
  const { t } = useTranslation();

  // render
  return (
    <Block
      is="section"
      data-markdown-block
    >
      <Title
        is="h2"
        data-markdown-title
        showLinkIcon
      >
        {t("page:sources")}
      </Title>
      <List variant={List.variant.DEFAULT}>
        {sources.map((source) => {
          const { host, origin } = new URL(source.url);

          return (
            <List.Item key={generateSlug(source.title)}>
              <Link
                variant={Link.variant.PRIMARY}
                href={source.url}
                className="tw-block"
                isExternalUrl
              >
                {source.title}
              </Link>
              <Link
                variant={Link.variant.SECONDARY}
                href={origin}
                className="tw-text-sm tw-italic"
                isExternalUrl
              >
                {host}
              </Link>
            </List.Item>
          );
        })}
      </List>
    </Block>
  );
}

export default Sources;

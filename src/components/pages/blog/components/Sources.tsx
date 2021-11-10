import * as React from "react";

import { Link, List, Title, Block } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import type { T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

function Sources({ sources }: { sources: { title: string; url: string }[] }): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Block is="section" data-markdown-block>
      <Title is="h2" data-markdown-title showLinkIcon>
        {t("page:sources")}
      </Title>
      <List variant={List.variant.DEFAULT}>
        {sources.map((source) => {
          const { host, origin } = new URL(source.url);

          return (
            <List.Item key={generateSlug(source.title)}>
              <Link variant={Link.variant.PRIMARY} href={source.url} className="tw-block" external>
                {source.title}
              </Link>
              <Link
                variant={Link.variant.SECONDARY}
                href={origin}
                className="tw-text-sm tw-italic"
                external
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

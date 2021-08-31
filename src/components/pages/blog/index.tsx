import React from "react";

import { Link, List, Title } from "~/components/primitive";
import { useTranslation } from "~/i18n";
import { T_ReactElement } from "~/types";
import { generateSlug } from "~/utils/strings";

export function Sources({
  sources,
}: {
  sources: { title: string; url: string }[];
}): T_ReactElement {
  const { t } = useTranslation();

  return (
    <section data-markdown-block>
      <Title is="h2" data-markdown-title showLinkIcon>
        {t("page:sources")}
      </Title>
      <List>
        {sources.map((source) => {
          const { host, origin } = new URL(source.url);

          return (
            <List.Item key={generateSlug(source.title)}>
              <Link href={source.url} className="tw-block">
                {source.title}
              </Link>
              <Link
                href={origin}
                variant={Link.variant.SECONDARY}
                className="tw-text-sm tw-italic tw-font-bold dfr-text-color-secondary"
                external
              >
                {host}
              </Link>
            </List.Item>
          );
        })}
      </List>
    </section>
  );
}

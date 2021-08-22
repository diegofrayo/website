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

  function extractWebsiteName(url: string): string {
    return new URL(url).host;
  }

  return (
    <section data-markdown-block>
      <Title is="h2" data-markdown-title showLinkIcon>
        {t("page:sources")}
      </Title>
      <List>
        {sources.map((source) => {
          return (
            <List.Item key={generateSlug(source.title)}>
              <Link href={source.url}>
                {source.title} | {extractWebsiteName(source.url)}
              </Link>
            </List.Item>
          );
        })}
      </List>
    </section>
  );
}

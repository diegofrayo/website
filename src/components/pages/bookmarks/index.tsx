import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Block, Link, List, Space, Title } from "~/components/primitive";
import type { T_Object, T_ReactElement } from "~/types";

type T_BookmarksProps = {
  bookmarks: T_Object<{ url: string; title: string }[]>;
};

function Bookmarks({ bookmarks }: T_BookmarksProps): T_ReactElement {
  const PAGE_TITLE = "Bookmarks";

  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        {Object.entries(bookmarks).map(([groupName, groupBookmarks], index) => {
          return (
            <Block key={groupName} className="tw-mb-8 last:tw-mb-0">
              <Title is="h2" variant={Title.variant.PRIMARY}>
                {groupName}
              </Title>
              <Space size={1} />
              <List variant={List.variant.DEFAULT}>
                {groupBookmarks.map((bookmark) => {
                  return (
                    <List.Item key={`bookmark-${index}`}>
                      <Link variant={Link.variant.PRIMARY} href={bookmark.url} isExternalUrl>
                        {bookmark.title}
                      </Link>
                    </List.Item>
                  );
                })}
              </List>
            </Block>
          );
        })}
      </MainLayout>
    </Page>
  );
}

export default Bookmarks;

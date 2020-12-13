import * as React from "react";
import NextLink from "next/link";

import { Page, MainLayout, Emoji } from "~/components";
import { getSiteTexts } from "~/i18n";
import { Routes } from "~/utils/constants";

const SiteTexts = getSiteTexts({ page: Routes.HOME });

function HomePage(): any {
  return (
    <Page>
      <MainLayout title={SiteTexts.page.title}>
        <MainMenu />
      </MainLayout>
    </Page>
  );
}

export default HomePage;

// --- Components ---

function MainMenu() {
  const ITEMS = [
    { emoji: "✍️", label: SiteTexts.page.menu_item_blog, url: Routes.BLOG() },
    { emoji: "🙋‍♂️", label: SiteTexts.page.menu_item_about_me, url: Routes.ABOUT_ME },
    { emoji: "📄", label: SiteTexts.page.menu_item_resume, url: Routes.RESUME },
    { emoji: "🚀", label: SiteTexts.page.menu_item_roadmap, url: Routes.ROADMAP },
  ];

  return (
    <nav className="tw-mt-8 tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
      {ITEMS.map((item, index) => {
        return (
          <section
            key={`MainMenuItem-${index}`}
            className="twc-border-color-primary tw-border tw-inline-block tw-transition-all tw-relative tw-mb-4 md:tw-mb-0 tw-mx-2 tw-cursor-pointer tw-rounded-md hover:tw-opacity-75 hover:tw-top-1px hover:tw-left-1px"
          >
            <NextLink href={item.url}>
              <a className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-py-2 tw-font-bold tw-h-full">
                <Emoji>{item.emoji}</Emoji>
                <span className="tw-text-center">{item.label}</span>
              </a>
            </NextLink>
            <Emoji className="twc-bg-icons twc-border-color-primary dark:twc-bg-icons tw-border tw-absolute tw--top-2 tw--left-2 tw-rounded-full tw-p-1 tw-text-sm tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center">
              📎
            </Emoji>

            <style jsx>{`
              section {
                height: 100px;
                width: 150px;
              }
            `}</style>
          </section>
        );
      })}
    </nav>
  );
}

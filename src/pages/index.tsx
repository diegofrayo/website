import * as React from "react";
import Link from "next/link";

import { Page, MainLayout } from "~/components";
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
    { emoji: "🙋‍♂️", label: SiteTexts.page.menu_item_blog, url: Routes.BLOG() },
    { emoji: "✍️", label: SiteTexts.page.menu_item_about_me, url: Routes.ABOUT_ME },
    { emoji: "📄", label: SiteTexts.page.menu_item_resume, url: Routes.RESUME },
    { emoji: "🚀", label: SiteTexts.page.menu_item_roadmap, url: Routes.ROADMAP },
  ];

  return (
    <nav className="tw-mt-8">
      <ul className="tw-flex tw-flex-wrap tw-justify-center sm:tw-justify-between">
        {ITEMS.map((item, index) => {
          return (
            <li
              key={`MainMenuItem-${index}`}
              className="tw-inline-block tw-border tw-border-gray-200 tw-transition-all tw-relative tw-mb-4 md:tw-mb-0 tw-mx-2 tw-cursor-pointer tw-rounded-md hover:tw-opacity-75 hover:tw-top-1px"
            >
              <Link href={item.url}>
                <a className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-py-2 tw-font-bold tw-h-full">
                  <span>{item.emoji}</span>
                  <span className="tw-text-center">{item.label}</span>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        li {
          height: 100px;
          width: 150px;
        }
      `}</style>
    </nav>
  );
}

import * as React from "react";
import Link from "next/link";

import { Page, MainLayout, Separator } from "~/components";
import { getSiteTexts } from "~/i18n";
import { Routes } from "~/utils/constants";

const SiteTexts = getSiteTexts({ page: Routes.HOME });

function HomePage(): any {
  return (
    <Page>
      <MainLayout title={SiteTexts.page.title}>
        <section className="tw-border-l-4 tw-border-black tw-pl-4">
          <p
            className="tw-text-black tw-italic"
            dangerouslySetInnerHTML={{ __html: SiteTexts.page.body }}
          />
          <Separator size={4} />
          <MainMenu />
        </section>
      </MainLayout>
    </Page>
  );
}

export default HomePage;

// --- Components ---

function MainMenu() {
  const ITEMS = [
    { label: SiteTexts.page.menu_item_blog, url: Routes.BLOG() },
    { label: SiteTexts.page.menu_item_about_me, url: Routes.ABOUT_ME },
    { label: SiteTexts.page.menu_item_resume, url: Routes.RESUME },
    { label: SiteTexts.page.menu_item_roadmap, url: Routes.ROADMAP },
  ];

  return (
    <nav>
      <ul className="tw-flex tw-flex-wrap md:tw-flex-nowrap tw-justify-between">
        {ITEMS.map((item, index) => {
          return (
            <li
              key={`MainMenuItem-${index}`}
              className="tw-inline-block tw-border-l-4 tw-border-b-4 tw-border-gray-200 tw-transition-all hover:tw-border-black hover:tw-text-black md:tw-mb-0 tw-cursor-pointer tw-relative hover:tw-top-1px"
            >
              <Link href={item.url}>
                <a className="tw-flex tw-items-center tw-justify-start tw-w-full tw-pl-3 tw-py-2 tw-font-bold">
                  {item.label}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        li {
          @apply tw-mb-4;
          width: 100%;

          @screen sm {
            width: 48%;
          }

          @screen md {
            @apply tw-mb-0;
            width: 23%;
          }
        }

        li:last-child {
          @apply tw-mb-0;
        }

        li:nth-last-child(-n + 2) {
          @screen sm {
            @apply tw-mb-0;
          }
        }
      `}</style>
    </nav>
  );
}

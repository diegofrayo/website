import * as React from "react";
import Link from "next/link";

import { Page, MainLayout, UL, Separator } from "~/components";
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
          ></p>
          <Separator size={4}></Separator>
          <MainMenu></MainMenu>
          <Separator className="tw-mt-6 tw-mb-4 tw-border-t tw-border-gray-200"></Separator>
          <section className="tw-text-black">
            <h2 className="tw-text-xl tw-mb-2">Roadmap 🚀</h2>
            <UL>
              <li>
                Terminar de escribir los <strong>blog posts</strong> que están en
                construcción
              </li>
              <li>
                Traducir el contenido de <strong>español</strong> a{" "}
                <strong>inglés</strong>
              </li>
              <li>
                Mejorar el <strong>SEO</strong>
              </li>
              <li>
                Configurar <strong>ESLint</strong> para <strong> TypeScript</strong> y{" "}
                <strong>React Hooks</strong>
              </li>
              <li>
                Aprender y usar bien <strong>TypeScript</strong> para dejar de usar{" "}
                <strong>any</strong> en todos lados
              </li>
            </UL>
          </section>
        </section>
      </MainLayout>
    </Page>
  );
}

export default HomePage;

// --- Components ---

function MainMenu() {
  const ITEMS = [
    { label: SiteTexts.page.menu_item_about_me, url: Routes.ABOUT_ME },
    { label: SiteTexts.page.menu_item_blog, url: Routes.BLOG() },
  ];

  return (
    <nav>
      <ul className="tw-flex tw-flex-wrap">
        {ITEMS.map((item, index) => {
          return (
            <li
              key={`MainMenuItem-${index}`}
              className="tw-inline-block tw-w-full sm:tw-w-48 tw-border-l-4 tw-border-b-4 tw-border-gray-200 tw-transition-all  hover:tw-border-black hover:tw-text-black tw-mr-0 sm:tw-mr-3 tw-mb-3 last:tw-mb-0 sm:tw-mb-0 tw-cursor-pointer tw-relative hover:tw-top-0.5"
            >
              <Link href={item.url}>
                <a className="tw-flex tw-items-center tw-justify-center tw-w-full tw-p-2 tw-font-bold">
                  {item.label}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

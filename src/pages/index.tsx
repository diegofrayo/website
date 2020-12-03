import * as React from "react";
import Link from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { Separator } from "~/components/primitive";
import tw from "~/lib/twcss";
import { Routes } from "~/utils/constants";

function HomePage(): any {
  return (
    <Page>
      <MainLayout title="👋 Bienvenido">
        <Content>
          <p className="tw-text-xl tw-text-gray-700 tw-text-justify tw-leading-8">
            En este sitio web, que todavía está en construcción y así seguirá por un largo
            tiempo, quiero escribir acerca de mi experiencia usando las herramientas que
            uso día a día como desarrollador de Software y con algunas que aún no he
            usado. 🧐 <br />
            También me gustaría escribir acerca de otros temas diferentes a programación
            pero no tengo idea cuales. 🤷‍♂️
          </p>
          <Separator size={4}></Separator>
          <MainMenu></MainMenu>
        </Content>
      </MainLayout>
    </Page>
  );
}

export default HomePage;

// --- Components ---

const Content = tw.section`tw-border-l-8 tw-border-gray-700 tw-pl-4`;

function MainMenu() {
  const ITEMS = [
    { label: "🙋‍♂️ Acerca de mi", url: Routes.ABOUT_ME },
    { label: "✍️ Blog", url: Routes.BLOG() },
  ];

  return (
    <nav>
      <ul className="tw-flex tw-flex-wrap">
        {ITEMS.map((item, index) => {
          return (
            <li
              key={`MainMenuItem-${index}`}
              className="tw-inline-block tw-w-full sm:tw-w-48 tw-border-l-4 tw-border-b-4 tw-border-gray-200 tw-transition-all tw-text-gray-800 hover:tw-border-gray-700 tw-mr-0 sm:tw-mr-1 tw-mb-3 last:tw-mb-0 sm:tw-mb-0 tw-cursor-pointer"
            >
              <Link href={item.url}>
                <a className="tw-flex tw-items-center tw-justify-center tw-w-full tw-p-2">
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

import * as React from "react";
import Link from "next/link";

import { Page, MainLayout } from "~/components/layout";
import { Separator } from "~/components/primitive";
import tw from "~/lib/twcss";
import { Routes } from "~/utils/constants";

function Home(): any {
  return (
    <Page>
      <MainLayout>
        <Separator size={4}></Separator>
        <Content>
          <p className="tw-text-xl tw-text-gray-700 tw-text-justify tw-leading-8">
            Bienvenido a mi sitio web 🖐️
            <br />
            En donde quiero escribir acerca de mi experiencia usando las herramientas que
            uso día a día{" "}
            <span className="tw-italic tw-font-bold">
              (JavaScript, React, Next.js, Tailwind CSS, Node.js y GraphQL){" "}
            </span>{" "}
            y con algunas que aún no he usado. 🛠️ <br />
            También me gustaría escribir acerca de otros temas diferentes a programación
            pero no tengo idea cuales. 🤷‍♂️
            <br />
            Así que planeo construir este sitio web con un montón de herramientas
            innecesarias para la simplicidad de este sitio y desconocidas para mi. 🙈
          </p>
          <Separator size={4}></Separator>
          <MainMenu></MainMenu>
        </Content>
      </MainLayout>
    </Page>
  );
}

// --- Components ---

const Content = tw.section`tw-border-l-8 tw-border-gray-700 tw-pl-4`;

function MainMenu() {
  return (
    <nav>
      <ul className="tw-flex tw-flex-wrap">
        <MainMenuItem>
          <Link href={Routes.ABOUT_ME}>
            <a className="tw-flex tw-items-center tw-justify-center tw-w-full tw-p-2">
              <span className="tw-mr-1">🤚</span> Acerca de mi
            </a>
          </Link>
        </MainMenuItem>
        <MainMenuItem>
          <Link href={Routes.BLOG()}>
            <a className="tw-flex tw-items-center tw-justify-center tw-w-full tw-p-2">
              <span className="tw-mr-1">✍️</span> Blog
            </a>
          </Link>
        </MainMenuItem>
      </ul>
    </nav>
  );
}

const MainMenuItem = tw.li(
  "tw-inline-block tw-w-full sm:tw-w-48 tw-border-l-4 tw-border-b-4 tw-border-gray-200 tw-transition-all tw-text-gray-800 hover:tw-border-gray-700 tw-mr-0 sm:tw-mr-1 tw-mb-3 last:tw-mb-0 sm:tw-mb-0 tw-cursor-pointer",
);

export default Home;

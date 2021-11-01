import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { useTranslation, getPageContentStaticProps } from "~/i18n";
import { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function HomePage(): T_ReactElement {
  const { t } = useTranslation();

  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.HOME,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <MainLayout title="👋">
        <div
          className="dfr-bg-secondary dfr-border-primary dfr-shadow dark:dfr-border-primary dark:dfr-shadow dark:dfr-bg-secondary tw-border-l-8 tw-border-b-8 tw-p-8 tw-text-xl"
          dangerouslySetInnerHTML={{ __html: t("page:content") }}
        />
      </MainLayout>
    </Page>
  );
}

export default HomePage;

// --- Next.js functions ---

export const getStaticProps = getPageContentStaticProps({
  page: ROUTES.HOME,
});

/*
// TODO: Finish home page

<div className="tw-hidden">
<div className="tw-px-4 tw-py-10">
  <div className="tw-mb-8 tw-text-center">
    <Title>ABOUT ME</Title>
  </div>

  <div className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      className="dfr-transition-opacity tw-h-32 tw-w-32"
      alt="Hobbies illustration"
    />
    <div className="tw-text-right tw-ml-4 tw-max-w-sm">
      <p>Im {new Date().getFullYear() - 1993} years old</p>
      <p>Me gusta la musica, el futbol, las hamburguesas, los paisajes y tomar fotos</p>

      <button>Mas sobre mi</button>
    </div>
  </div>
</div>
<Border />
<div className="tw-bg-gay-100 tw-px-4 tw-py-10 tw-min-h-screden">
  <div className="tw-mb-8 tw-text-center">
    <Title>CAREER</Title>
  </div>

  <div className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      alt=""
      className="tw-h-32 tw-w-32 tw-transition-opacity hover:tw-opacity-80"
    />
    <div className="tw-text-left tw-ml-4">
      <p>Im located at Armenia, Quindio</p>
      <p>Im 20 years old</p>
      <p>Me gusta la musica, el futbol y las hamburguesas</p>

      <button>Mas sobre mi</button>
    </div>
  </div>
</div>
<Border />
<div className="tw-bg-gay-100 tw-px-4 tw-py-10 tw-min-h-screden">
  <div className="tw-mb-8 tw-text-center">
    <Title>BLOG</Title>
  </div>

  <div className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      alt=""
      className="tw-h-32 tw-w-32 tw-transition-opacity hover:tw-opacity-80"
    />
    <div className="tw-text-left tw-ml-4">
      <p>Im located at Armenia, Quindio</p>
      <p>Im 20 years old</p>
      <p>Me gusta la musica, el futbol y las hamburguesas</p>

      <button>Mas sobre mi</button>
    </div>
  </div>
</div>
<Border />
<div className="tw-bg-gay-100 tw-px-4 tw-py-10 tw-min-h-screden">
  <div className="tw-mb-8 tw-text-center">
    <Title>PERSONAL PROJECTS</Title>
  </div>

  <div className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      alt=""
      className="tw-h-32 tw-w-32 tw-transition-opacity hover:tw-opacity-80"
    />
    <div className="tw-text-left tw-ml-4">
      <p>Im located at Armenia, Quindio</p>
      <p>Im 20 years old</p>
      <p>Me gusta la musica, el futbol y las hamburguesas</p>

      <button>Mas sobre mi</button>
    </div>
  </div>
</div>
</div>

// --- Components ---

function Title({ children }) {
  return (
    <h1 className="tw-text-3xl tw-font-bold tw-border-4 tw-border-transparent tw-inline-block tw-text-black dark:tw-text-white tw-py-1 tw-px-2 tw-transition-all hover:tw-opacity-80 hover:tw-border-black dark:hover:tw-border-white">
      {children}

      <style jsx>{`
        h1 {
          background-image: url("/static/images/new/texture.png");
        }
      `}</style>
    </h1>
  );
}

function Border() {
  return (
    <div className="root tw-max-w-full tw-w-48 tw-h-8 tw-mx-auto tw-my-16">
      <style jsx>{`
        .root {
          background-image: url("/static/images/new/border.svg");
          background-repeat-x: repeat;
          background-repeat-y: no-repeat;
          background-size: 24px 34px;
        }

        :global(.tw-dark) .root {
          background-image: url("/static/images/new/border-dark.svg");
        }
      `}</style>
    </div>
  );
}
*/

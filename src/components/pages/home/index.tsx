import * as React from "react";
import hydrate from "next-mdx-remote/hydrate";

import { Page, MainLayout } from "~/components/layout";
import { Block } from "~/components/primitive";
import { MDXContent } from "~/components/shared";
import { useTranslation } from "~/i18n";
import type { T_ReactElement } from "~/types";
import { MDXComponents } from "~/utils/mdx";
import { ROUTES } from "~/utils/routing";

function Home({ mdxContent }: { mdxContent: string }): T_ReactElement {
  const { t } = useTranslation();

  const mdxContentParsed = hydrate(mdxContent, { components: MDXComponents });

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
        <Block className="dfr-bg-color-primary dfr-border-color-primary dfr-shadow tw-border-8 tw-px-4 tw-py-8 tw-text-center sm:tw-px-8 sm:tw-py-16 dark:dfr-border-color-primary dark:dfr-shadow dark:dfr-bg-color-primary">
          <MDXContent content={mdxContentParsed} />
        </Block>
      </MainLayout>
    </Page>
  );
}

export default Home;

/*
// TODO: Finish home page

<Block className="tw-hidden">
<Block className="tw-px-4 tw-py-10">
  <Block className="tw-mb-8 tw-text-center">
    <Title>ABOUT ME</Title>
  </Block>

  <Block className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      className="dfr-transition-opacity tw-h-32 tw-w-32"
      alt="Hobbies illustration"
    />
    <Block className="tw-text-right tw-ml-4 tw-max-w-sm">
      <Text>Im {new Date().getFullYear() - 1993} years old</Text>
      <Text>Me gusta la musica, el futbol, las hamburguesas, los paisajes y tomar fotos</Text>

      <button>Mas sobre mi</button>
    </Block>
  </Block>
</Block>
<Border />
<Block className="tw-bg-gay-100 tw-px-4 tw-py-10 tw-min-h-screden">
  <Block className="tw-mb-8 tw-text-center">
    <Title>CAREER</Title>
  </Block>

  <Block className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      alt=""
      className="tw-h-32 tw-w-32 tw-transition-opacity hover:tw-opacity-80"
    />
    <Block className="tw-text-left tw-ml-4">
      <Text>Im located at Armenia, Quindio</Text>
      <Text>Im 20 years old</Text>
      <Text>Me gusta la musica, el futbol y las hamburguesas</Text>

      <button>Mas sobre mi</button>
    </Block>
  </Block>
</Block>
<Border />
<Block className="tw-bg-gay-100 tw-px-4 tw-py-10 tw-min-h-screden">
  <Block className="tw-mb-8 tw-text-center">
    <Title>BLOG</Title>
  </Block>

  <Block className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      alt=""
      className="tw-h-32 tw-w-32 tw-transition-opacity hover:tw-opacity-80"
    />
    <Block className="tw-text-left tw-ml-4">
      <Text>Im located at Armenia, Quindio</Text>
      <Text>Im 20 years old</Text>
      <Text>Me gusta la musica, el futbol y las hamburguesas</Text>

      <button>Mas sobre mi</button>
    </Block>
  </Block>
</Block>
<Border />
<Block className="tw-bg-gay-100 tw-px-4 tw-py-10 tw-min-h-screden">
  <Block className="tw-mb-8 tw-text-center">
    <Title>PERSONAL PROJECTS</Title>
  </Block>

  <Block className="tw-flex tw-justify-center tw-items-center">
    <img
      src="/static/images/home/about-me.png"
      alt=""
      className="tw-h-32 tw-w-32 tw-transition-opacity hover:tw-opacity-80"
    />
    <Block className="tw-text-left tw-ml-4">
      <Text>Im located at Armenia, Quindio</Text>
      <Text>Im 20 years old</Text>
      <Text>Me gusta la musica, el futbol y las hamburguesas</Text>

      <button>Mas sobre mi</button>
    </Block>
  </Block>
</Block>
</Block>

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
    <Block className="root tw-max-w-full tw-w-48 tw-h-8 tw-mx-auto tw-my-16">
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
    </Block>
  );
}
*/
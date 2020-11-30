import * as React from "react";

import { Page } from "~/components/layout";

function Home(): any {
  const SOCIAL_NETWORKS = [
    { icon: "github", url: "https://github.com/diegofrayo" },
    { icon: "twitter", url: "https://twitter.com/diegofrayo" },
    {
      icon: "linkedin",
      url: "https://www.linkedin.com/in/diegofrayo/",
    },
    {
      icon: "500px",
      url: "https://500px.com/p/diegofrayo?view=photos",
    },
  ];

  return (
    <Page>
      <div className="tw-flex tw-flex-col tw-h-full">
        <section className="tw-mx-auto tw-max-w-screen-md tw-flex-1 tw-overflow-auto tw-p-6">
          <section className="tw-text-center tw-mb-3">
            <span className="tw-inline-block tw-border-4 tw-border-blue-500 tw-bg-blue-200 tw-rounded-full tw-p-4 tw-text-6xl">
              👨‍💻
            </span>
          </section>

          <h1 className="tw-text-center tw-text-3xl tw-text-gray-900 tw-mb-8">
            Hola, soy <strong>Diego Rayo</strong> 👋
          </h1>

          <p className="tw-text-gray-700 tw-text-justify tw-leading-snug">
            Soy desarrollador de Software. Trabajo usualmente con JavaScript, React,
            Next.js, TailwindCSS, Node y GraphQL. Acabo de crear este sitio web en donde
            espero escribir acerca de mi experiencia usando las herramientas que uso día a
            día y con algunas que quiero probar y aún no le he hecho. 🤓 <br /> Así que
            planeo construir este sitio web con un montón de herramientas innecesarias
            para la simplicidad de este sitio. 🙈
          </p>
        </section>

        <footer className="tw-text-center tw-bg-gray-800 tw-pt-2 tw-mt-4">
          {SOCIAL_NETWORKS.map(item => (
            <SocialIcon key={item.icon} {...item}></SocialIcon>
          ))}
        </footer>
      </div>
    </Page>
  );
}

// --- Components ---

function SocialIcon({ icon, url }) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={url}
      className="tw-inline-block tw-m-2 tw-bg-gray-100 tw-rounded-md tw-p-3 tw-border tw-border-gray-200 hover:tw-opacity-75 tw-transition-opacity"
    >
      <img
        src={`/images/icons/${icon}.svg`}
        alt={`${icon} icon`}
        className="tw-h-5 tw-w-5"
      />
    </a>
  );
}

export default Home;

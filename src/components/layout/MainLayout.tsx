import React from "react";

import { Separator } from "~/components/primitive";
import twcss from "~/lib/twcss";

export default function MainLayout({ children }: Record<string, unknown>): any {
  return (
    <Main>
      <Header></Header>
      <Separator size={1}></Separator>
      <section>{children}</section>
    </Main>
  );
}

// --- Components ---

const Main = twcss.main`tw-max-w-screen-md tw-w-full tw-p-6 tw-mx-auto`;

function Header() {
  return (
    <header className="tw-flex sm:tw-items-center tw-border-b tw-border-gray-100 tw-pb-3">
      <section className="tw-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-border-4 tw-border-blue-500 tw-bg-blue-200 tw-mr-4 tw-rounded-full">
        <span className="tw-text-3xl">👨‍💻</span>
      </section>
      <section className="tw-flex-1 tw-text-left">
        <h1 className="tw-text-3xl tw-text-gray-900">
          <strong>Diego Rayo</strong> 👋
        </h1>
        <section className="tw-flex tw-flex-wrap tw-items-center">
          <p className="tw-text-gray-800 tw-inline-block tw-mr-2">Software Developer</p>
          <SocialIcons></SocialIcons>
        </section>
      </section>
    </header>
  );
}

function SocialIcons() {
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
    <section className="tw-inline-flex tw-items-center tw-my-1">
      {SOCIAL_NETWORKS.map(item => (
        <SocialIcon key={item.icon} {...item}></SocialIcon>
      ))}
    </section>
  );
}

function SocialIcon({ icon, url }) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={url}
      className="tw-inline-block tw-bg-gray-100 tw-p-1 tw-border tw-border-gray-200 hover:tw-opacity-75 tw-transition-opacity tw-rounded-full tw-mr-2"
    >
      <img
        src={`/static/images/icons/${icon}.svg`}
        alt={`${icon} icon`}
        className="tw-h-4 tw-w-4"
      />
    </a>
  );
}

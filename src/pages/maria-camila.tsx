import React from "react";
import classNames from "classnames";

import { Block } from "~/components/primitive";
import { useDocumentTitle } from "~/hooks";
import { T_ReactElement } from "~/types";

function MariaCamila(): T_ReactElement {
  useDocumentTitle("Feliz cumple!!");

  return (
    <Block className="tw-max-w-lg tw-mx-auto tw-p-6">
      <link rel="icon" href="/static/images/favicon/favicon.ico" />

      <Title className="tw-mb-12">
        🎉
        <br />
        Feliz cumpleaños!
        <br />
        Maria Camila
        <br />
        👩‍⚕️
      </Title>

      <Text emoji="🤓" left>
        Se que esto es muy <Marked>nerd</Marked>
      </Text>

      <Text emoji="🙁">
        Que no hubo <Marked>frisby</Marked> o <Marked>cartica</Marked> este año
      </Text>

      <Text emoji="👧" left>
        Que ayer te dije que todavía no eras una <Marked>bichota</Marked>
      </Text>

      <Text emoji="👸">
        Pero creo que ya lo <Marked>eres!</Marked>
      </Text>

      <Block className="tw-my-8">
        <a href="/static/images/maria-camila.jpg" target="_blank" className="tw-block">
          <img
            src="/static/images/maria-camila.jpg"
            className="tw-rounded-tr-md tw-rounded-bl-md tw-border-8 tw-border-black tw-shadow-md"
            alt="Foto"
          />
        </a>
        <p className="tw-text-center tw-italic tw-text-sm tw-mt-1 tw-px-4">
          esta es la única foto <br /> que tengo de los dos juntos 🤷‍♂️
        </p>
      </Block>

      <hr className="tw-border tw-border-yellow-200 tw-h-px tw-border-dashed tw-mt-10 tw-shadow-md tw-opacity-50" />

      <Block className="tw-my-8">
        <Title className="tw-mb-4">
          Te deseo que la pases muy bien y admiro mucho tu profesión 🤩
        </Title>
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/MIur6bNcwHA"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Block>

      <style jsx>{`
        :global(body) {
          @apply tw-bg-yellow-100;
        }
      `}</style>
    </Block>
  );
}

export default MariaCamila;

// --- Components ---

function Text({ children, emoji, left = false }) {
  return (
    <Block
      className={classNames(
        "tw-text-lg tw-my-6 tw-flex tw-items-center",
        left ? "tw-text-left tw-pr-10" : "tw-text-right tw-pl-10 tw-flex-row-reverse",
      )}
    >
      <span className="tw-text-3xl tw-flex-shrink-0">{emoji}</span>
      <span className="tw-mx-3">{children}</span>
    </Block>
  );
}

function Marked({ children }) {
  return (
    <u>
      <b>{children}</b>
    </u>
  );
}

function Title({ children, className }) {
  return (
    <h1 className={classNames("tw-font-bold tw-text-3xl tw-text-center", className)}>{children}</h1>
  );
}

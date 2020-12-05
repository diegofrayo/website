import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";

import { Link } from "./";
import twcss from "~/lib/twcss";

// shared

export function Code({ children, source }: Record<string, any>): any {
  return (
    <section className="root tw-mb-6">
      <Highlight {...defaultProps} code={children} language="jsx" theme={dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre className={className} style={style}>
              {tokens.map((line, i) => {
                return (
                  <Line key={i} {...getLineProps({ line, key: i })}>
                    <LineNo>{i + 1}</LineNo>
                    <LineContent>
                      {line.map((token, key) => {
                        return <span key={key} {...getTokenProps({ token, key })} />;
                      })}
                    </LineContent>
                  </Line>
                );
              })}
            </pre>
          );
        }}
      </Highlight>
      <section className="tw-text-right">
        {source && (
          <Link className="tw-block sm:tw-inline-block sm:tw-mr-4" href={source}>
            <img
              src="/static/images/icons/github.svg"
              alt="Github icon"
              className="tw-h-3 tw-w-3 tw-inline-block tw-align-middle tw-mr-1"
            />
            <span className="tw-inline-block tw-text-sm">Ver código fuente</span>
          </Link>
        )}
        <Link
          data-clipboard-text={children}
          className="clipboard tw-block sm:tw-inline-block tw-text-sm  tw-mt-1 sm:tw-mt-0 tw-no-underline"
          role="button"
        >
          📋 Copiar al portapeles
        </Link>
      </section>

      <style jsx>{`
        .root pre,
        .root img {
          @apply tw-my-0;
        }
      `}</style>
    </section>
  );
}

const Line = twcss.div`tw-table-row`;
const LineNo = twcss.span`tw-table-cell tw-text-right tw-pr-4 tw-opacity-50 tw-select-none`;
const LineContent = twcss.span`tw-table-cell`;

export function GithubRepo({ name, url, description }: Record<string, any>): any {
  return (
    <section className="root tw-mb-8">
      <Link
        className="tw-flex sm:tw-inline-flex tw-p-4 tw-bg-gray-100 tw-rounded-md tw-items-center tw-border tw-border-gray-200"
        href={url}
      >
        <img
          src="/static/images/icons/github.svg"
          alt="Github icon"
          className="tw-h-8 tw-w-8 tw-mr-3"
        />
        <section className="tw-flex-1">
          <h3>diegofrayo/{name}</h3>
          <p className="tw-text-sm tw-text-gray-700">{description}</p>
        </section>
      </Link>

      <style jsx>{`
        .root :global(a) {
          @apply tw-no-underline;
        }

        .root img,
        .root h3,
        .root p {
          @apply tw-my-0;
        }

        .root h3 {
          @apply tw-text-base;

          @screen sm {
            @apply tw-text-lg;
          }
        }
      `}</style>
    </section>
  );
}

// mi-musica-favorita-y-mdx

export function HelloWorldMDX(): any {
  return (
    <p className="tw-bg-red-200 tw-block tw-p-2 tw-text-red-700 tw-rounded-md">
      Hola, soy un componente React que usa Tailwind CSS para sus estilos
    </p>
  );
}

export function SpotifyPlaylist(): any {
  // return null;
  return (
    <section className="tw-border-4 tw-border-pink-400">
      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZF1EM1nsROE2cRZE"
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
        allowTransparency
      ></iframe>
    </section>
  );
}

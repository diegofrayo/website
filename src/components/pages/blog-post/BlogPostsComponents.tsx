import React from "react";

// general

export function Link({ children, href, className }: Record<string, any>): any {
  return (
    <a target="_blank" rel="noreferrer" href={href} className={className}>
      {children}
    </a>
  );
}

// shared

export function CustomCode({ children, source }) {
  return (
    <section className="root tw-overflow-auto">
      <pre>{children}</pre>
      <Link className="tw-float-right tw-inline-block" href={source}>
        <img
          src="/static/images/icons/github.svg"
          alt="Github icon"
          className="tw-h-3 tw-w-3 tw-inline-block tw-align-middle tw-mr-1"
        />
        <span className="tw-inline-block tw-text-sm">Ver código fuente</span>
      </Link>

      <style jsx>{`
        .root pre,
        .root img {
          @apply tw-my-0;
        }
      `}</style>
    </section>
  );
}

export function GithubRepo({ name, url, description }) {
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
          <p className="tw-text-gray-700 tw-text-sm">{description}</p>
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

export function IframeContainer({ children }: Record<string, any>): any {
  // return null;
  return <section className="tw-border-4 tw-border-pink-400">{children}</section>;
}

export function HelloWorldMDX(): any {
  return (
    <p className="tw-bg-red-200 tw-block tw-p-1 tw-text-red-700 tw-rounded-md">
      Hola, soy un componente React que usa Tailwind CSS para sus estilos
    </p>
  );
}

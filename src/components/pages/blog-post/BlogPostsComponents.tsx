import React from "react";

// general

export function Link({ children, href }: Record<string, any>): any {
  return (
    <a target="_blank" rel="noreferrer" href={href} className="tw-underline">
      {children}

      <style jsx>{`
        a {
          @apply tw-text-blue-600;
        }
      `}</style>
    </a>
  );
}

// mi-musica-favorita-y-mdx

export function IframeContainer({ children }: Record<string, any>): any {
  return <section className="tw-border-4 tw-border-pink-400">{children}</section>;
}

export function HelloWorldMDX(): any {
  return (
    <p className="tw-bg-red-200 tw-block tw-p-1 tw-text-red-700 tw-rounded-md">
      Hola, soy un componente React que usa Tailwind CSS para sus estilos
    </p>
  );
}

/*
export function SourceCodeLink({ children, href }) {
  return (
    <a target="_blank" href={href} className="tw-underline">
      {children}

      <style jsx>{`
        a {
          @apply tw-text-blue-600;
        }
      `}</style>
    </a>
  );
}

export function Code({ children, source }) {
  return (
    <Fragment>
      <pre>{children}</pre>
      <a href="">{source}</a>
    </Fragment>
  );
}
*/

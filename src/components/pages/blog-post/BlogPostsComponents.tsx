import * as React from "react";

// mi-musica-favorita-y-mdx

export function IframeContainer({ children }: Record<string, any>): any {
  // return null;
  return <section className="tw-border-4 tw-border-pink-400">{children}</section>;
}

export function HelloWorldMDX(): any {
  return (
    <p className="tw-text-red-700">
      Hola, soy un componente React que usa Tailwind CSS para sus estilos
    </p>
  );
}

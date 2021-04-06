import React from "react";

function Code({ children, variant = "DEFAULT", ...rest }) {
  if (variant === "INLINE") {
    return (
      <code>
        {children}

        <style jsx>{`
          code {
            @apply tw-text-base;
            @apply tw-text-red-700;
            font-style: italic;
          }

          :global(.tw-dark) code {
            @apply tw-text-red-400;
          }

          code::before,
          code::after {
            content: "\`";
          }
        `}</style>
      </code>
    );
  }

  return (
    <pre {...rest}>
      <code>{children}</code>

      <style jsx>{`
        pre {
          @apply tw-bg-gray-800;
          @apply tw-p-4;
          @apply tw-text-base;
          @apply tw-text-gray-300;
          @apply tw-rounded-md;
          display: block;
          max-width: 100%;
          overflow-x: auto;
          word-break: keep-all;
        }

        :global(.tw-dark) pre {
          @apply tw-bg-gray-700;
        }
      `}</style>
    </pre>
  );
}

Code.variant = {
  DEFAULT: "DEFAULT",
  INLINE: "INLINE",
};

export default Code;

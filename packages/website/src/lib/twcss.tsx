import React from "react";

const HTML_TAGS = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan",
];

type TypeStylesParam = { __base: string; initial: string } | string[] | string;
type TypeTWCSS_ComponentProps = {
  children?: any;
  className?: string;
  is: string | any;
  "tw-variant": string | Record<string, boolean> | undefined;
};
type TypeStaticPropsParam = {
  "tw-variant"?: TypeTWCSS_ComponentProps["tw-variant"];
};

// TODO: Element instead any
function twcssCreator(Tag: string | any): any {
  return function (styles: TypeStylesParam, staticProps: TypeStaticPropsParam = {}): any {
    return function TWCSS_Component({
      children,
      className = "",
      is,
      ["tw-variant"]: twVariant,
      ...rest
    }: TypeTWCSS_ComponentProps): any {
      const Element: string | any = is || Tag;
      const finalClassName: string = generateClassName(
        styles,
        className,
        twVariant || staticProps["tw-variant"],
      );

      return (
        <Element className={finalClassName} {...staticProps} {...rest}>
          {children}
        </Element>
      );
    };
  };
}

const twcss: any = Object.assign(
  twcssCreator,
  HTML_TAGS.reduce((result, tagName: string) => {
    result[tagName] = twcssCreator(tagName);
    return result;
  }, {}),
);

function generateClassName(
  styles: TypeStylesParam,
  className: string,
  twVariant: TypeTWCSS_ComponentProps["tw-variant"],
): string {
  if (Array.isArray(styles) || typeof styles === "string") {
    return `${styles} ${className}`.trim();
  }

  if (typeof styles === "object") {
    if (typeof twVariant === "object") {
      const twVariantStyles: string = Object.keys(twVariant)
        .reduce((acum: string, curr: string) => {
          if (twVariant[curr] === true && styles[curr]) {
            return acum + styles[curr] + " ";
          }

          return acum;
        }, "")
        .trim();

      return `${styles.__base || ""} ${twVariantStyles || styles.initial} ${className}`.trim();
    }

    if (typeof twVariant === "string") {
      return `${styles.__base || ""} ${styles[twVariant] || ""} ${className}`.trim();
    }

    return `${styles.__base || ""} ${className}`.trim();
  }

  return className.trim();
}

export default twcss;

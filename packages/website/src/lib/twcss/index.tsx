import React from "react";
import { T_ReactFCReturn } from "~/types";

import HTML_TAGS from "./tags";

type T_StylesParam = { __base: string; initial: string } | string[] | string;
type T_TWCSS_ComponentProps = {
  children?: any;
  className?: string;
  is: string | any;
  "tw-variant": string | Record<string, boolean> | undefined;
};
type T_StaticPropsParam = {
  "tw-variant"?: T_TWCSS_ComponentProps["tw-variant"];
};

function twcssCreator(
  Tag: string | JSX.Element,
): (styles: T_StylesParam, staticProps: T_StaticPropsParam) => React.FC {
  return function (styles: T_StylesParam, staticProps: T_StaticPropsParam = {}): React.FC {
    return React.forwardRef(function TWCSS_Component(
      { children, className = "", is, ["tw-variant"]: twVariant, ...rest }: T_TWCSS_ComponentProps,
      ref,
    ): T_ReactFCReturn {
      const Element: string | any = is || Tag;
      const finalClassName: string = generateClassName(
        styles,
        className,
        twVariant || staticProps["tw-variant"],
      );

      return (
        <Element className={finalClassName} ref={ref} {...staticProps} {...rest}>
          {children}
        </Element>
      );
    });
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
  styles: T_StylesParam,
  className: string,
  twVariant: T_TWCSS_ComponentProps["tw-variant"],
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

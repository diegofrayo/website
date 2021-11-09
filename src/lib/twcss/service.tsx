import * as React from "react";

import {
  T_Object,
  T_ReactChildrenProp,
  T_ReactElement,
  T_ReactForwardedRef,
  T_ReactFunctionComponent,
} from "~/types";

type T_StylesParam = { __base: string; initial: string } | string[] | string;
type T_TWCSS_ComponentProps = {
  children?: T_ReactChildrenProp;
  className?: string;
  is: string | T_ReactFunctionComponent;
  twcssVariant: string | T_Object<boolean> | undefined;
};

function twcssCreator(
  Tag: string | T_ReactFunctionComponent,
): (styles: T_StylesParam, staticProps: T_Object) => T_ReactFunctionComponent {
  return function (styles: T_StylesParam, staticProps: T_Object = {}): T_ReactFunctionComponent {
    return React.forwardRef(function TWCSS_Component(
      { children, className = "", is, twcssVariant, ...rest }: T_TWCSS_ComponentProps,
      ref,
    ): T_ReactElement {
      const Element = (is || Tag) as T_ReactFunctionComponent<{
        className: string;
        ref: T_ReactForwardedRef;
      }>;
      const finalClassName = generateClassName(
        styles,
        className,
        twcssVariant || staticProps.twcssVariant,
        rest,
      );

      return (
        <Element className={finalClassName} ref={ref} {...staticProps} {...rest}>
          {children}
        </Element>
      );
    });
  };
}

export default twcssCreator;

// --- Utils ---

function generateClassName(
  styles: T_StylesParam,
  className: string,
  twVariant: T_TWCSS_ComponentProps["twcssVariant"],
  props: any,
): string {
  if (Array.isArray(styles) || typeof styles === "string") {
    return `${styles} ${className}`.trim();
  }

  if (typeof styles === "object") {
    if (typeof styles[twVariant as string] === "function") {
      return `${styles.__base || ""} ${styles[twVariant as string](props)} ${className}`.trim();
    }

    if (typeof twVariant === "object") {
      const twVariantStyles = Object.keys(twVariant)
        .reduce((result: string, curr: string) => {
          if (twVariant[curr] === true && styles[curr]) {
            return result + styles[curr] + " ";
          }

          return result;
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

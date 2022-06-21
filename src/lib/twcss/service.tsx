import classNames from "classnames";
import * as React from "react";

import { isObject, isString } from "~/utils/validations";
import type { T_ReactChildren, T_ReactFunctionComponent, T_UnknownObject } from "~/types";

import type { T_HTMLTag } from "./constants";

const TWCSSCreator: I_TWCSSCreator = function TWCSSCreator(Tag) {
  const TWCSSComponentDefinition: I_TWCSSComponentDefinition = function TWCSSComponentDefinition(
    styles,
    staticProps = {},
  ) {
    const TWCSSReactComponent: T_TWCSSReactComponent = React.forwardRef(
      function TWCSSReactComponent({ children, className = "", is, TWCSSVariant, ...rest }, ref) {
        /* WARN:
         * This assertion is so useful and hard to remove
         * I have no problem to use it
         */
        const Element = (is || Tag) as T_ReactFunctionComponent<{
          [key: string]: unknown;
          ref: T_ReactForwardedRef;
        }>;
        const finalClassName = generateClassName({
          componentStyles: styles,
          classNameProp: className,
          TWCSSVariant,
          componentProps: rest as T_UnknownObject,
        });

        return (
          <Element
            className={finalClassName}
            ref={ref}
            {...staticProps}
            {...rest}
          >
            {children}
          </Element>
        );
      },
    );

    return TWCSSReactComponent;
  };

  return TWCSSComponentDefinition;
};

export default TWCSSCreator;

// --- Utils ---

type T_GenerateClassNameParams = {
  componentStyles: T_StylesParam;
  classNameProp: string;
  TWCSSVariant: string | undefined;
  componentProps: T_UnknownObject;
};

function generateClassName({
  componentStyles,
  classNameProp,
  TWCSSVariant,
  componentProps,
}: T_GenerateClassNameParams): string {
  // twcss.a`x y z` | twcss.a("x y z")
  if (Array.isArray(componentStyles) || isString(componentStyles)) {
    return classNames(componentStyles.toString(), classNameProp);
  }

  // twcss.a({ $TWCSS_BASE_STYLES: "y", a: "a", b: "b" c: (props) => `a ${props.x ? "s" : "w"}`})
  if (isObject(componentStyles)) {
    const TWCSSVariantStyles = isString(TWCSSVariant) ? componentStyles[TWCSSVariant] : "";

    return classNames(
      componentStyles.$TWCSS_BASE_STYLES,
      typeof TWCSSVariantStyles === "function"
        ? TWCSSVariantStyles(componentProps)
        : TWCSSVariantStyles,
      classNameProp,
    );
  }

  // twcss.a``
  return classNames(classNameProp);
}

// --- Types ---

export interface I_TWCSSCreator {
  (Tag: T_ElementToRender): I_TWCSSComponentDefinition;
}

export interface I_TWCSSComponentDefinition {
  (styles: T_StylesParam, staticProps?: T_UnknownObject): T_TWCSSReactComponent;
}

type T_TWCSSReactComponent = T_ReactFunctionComponent<{
  children?: T_ReactChildren;
  className?: string;
  TWCSSVariant?: string;
  is?: T_ElementToRender;
  [key: string]: unknown;
}>;

type T_StylesParam =
  | string
  | TemplateStringsArray
  | {
      $TWCSS_BASE_STYLES: T_StylesParamFunction;
      [key: string]: T_StylesParamFunction;
    };

type T_StylesParamFunction = string | ((props: T_UnknownObject) => string);

/*
 * WARN:
 * I don't know how to remove this any
 * styled-components also uses any to type this arg
 */
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T_ElementToRender = T_HTMLTag | T_ReactFunctionComponent<any>;

type T_ReactForwardedRef = React.ForwardedRef<unknown>;

import * as React from "react";

// --- Data ---

export type T_Primitive = string | number | boolean | null;

// --- Objects ---

type T_GenericObject<Type> = Record<string | number | symbol, Type>;

export type T_UnknownObject = T_GenericObject<unknown>;

export type T_ObjectWithPrimitives = T_GenericObject<T_Primitive>;

export type T_Object<Type = unknown> = T_GenericObject<Type>;

// --- React ---

export type T_ReactChildren = React.ReactNode;

export type T_ReactStylesProp = React.CSSProperties;

export type T_ReactNode = React.ReactNode;

export type T_ReactElement = JSX.Element;

export type T_ReactElementNullable = JSX.Element | null;

export type T_ReactFunctionComponent<G_ComponentProps = T_UnknownObject> =
  React.FunctionComponent<G_ComponentProps>;

export type T_ReactRefObject<RefType> = React.RefObject<RefType>;

// export type T_ReactForwardedRef = React.ForwardedRef<unknown>;

export type T_ReactEffectCallback = React.EffectCallback;

export type T_ReactSetState<T_State> = React.Dispatch<React.SetStateAction<T_State>>;

// --- React Event Handlers ---

export type T_ReactEventTarget = EventTarget;

export type T_ReactOnClickEventHandler<G_HTMLElement = HTMLButtonElement> =
  React.MouseEventHandler<G_HTMLElement>;

export type T_ReactOnClickEventObject<G_HTMLElement> = React.MouseEvent<G_HTMLElement>;

export type T_ReactOnChangeEventHandler<G_HTMLElement> = React.ChangeEventHandler<G_HTMLElement>;

export type T_ReactOnChangeEventObject = React.ChangeEvent<HTMLInputElement>;

export type T_ReactOnFocusEventHandler<G_HTMLElement = HTMLInputElement> =
  React.FocusEventHandler<G_HTMLElement>;

export type T_ReactOnKeyPressEventHandler<G_HTMLElement> =
  React.KeyboardEventHandler<G_HTMLElement>;

// --- HTML ---

export type T_HTMLElementAttributes = JSX.IntrinsicElements;

// --- JS ---

export type T_SetTimeout = NodeJS.Timeout;

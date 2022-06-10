import * as React from "react";

// --- Objects ---

type T_GenericObject<Type> = Record<string | number | symbol, Type>;

export type T_UnknownObject = T_GenericObject<unknown>;

export type T_ObjectWithPrimitives = T_GenericObject<string | number | boolean>;

export type T_Object<Type = unknown> = T_GenericObject<Type>;

// --- React ---

export type T_ReactChildren = React.ReactNode;

export type T_ReactStylesProp = React.CSSProperties;

export type T_ReactNode = React.ReactNode;

export type T_ReactElement = JSX.Element;

export type T_ReactElementNullable = JSX.Element | null;

export type T_ReactFunctionComponent<Props = T_UnknownObject> = React.FunctionComponent<Props>;

export type T_ReactRefObject<RefType> = React.RefObject<RefType>;

export type T_ReactForwardedRef = React.ForwardedRef<unknown>;

export type T_ReactEffectCallback = React.EffectCallback;

export type T_ReactSetState<T_State> = React.Dispatch<React.SetStateAction<T_State>>;

// --- React Event Handlers ---

export type T_OnClickEventObject<G_HTMLElement> = React.MouseEvent<G_HTMLElement>;

export type T_ReactEventTarget = EventTarget;

// export type T_OnChangeEvent<HTMLElement> = React.ChangeEventHandler<HTMLElement>;

// export type T_OnScrollEvent = React.UIEvent<HTMLElement>;

// export type T_FormEvent<HTMLElement> = React.FormEvent<HTMLElement>;

// --- HTML ---

export type T_HTMLElementAttributes = JSX.IntrinsicElements;

// --- JS ---

export type T_SetTimeout = NodeJS.Timeout;

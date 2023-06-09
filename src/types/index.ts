import * as React from "react";

// --- DATA ---

export type T_Primitive = string | number | boolean | null;

// --- OBJECTS ---

type T_GenericObject<G_Type = unknown> = Record<string | number | symbol, G_Type>;

export type T_Object<G_Type = unknown> = T_GenericObject<G_Type>;

export type T_JSON = T_GenericObject<
	string | number | boolean | null | T_JSON[] | { [key: string]: T_JSON }
>;

// --- REACT ---

// for children prop
export type T_ReactChildren = React.ReactNode;

// for styles prop
export type T_ReactStyles = React.CSSProperties;

export type T_ReactNode = React.ReactNode;

// for returns
export type T_ReactElement = JSX.Element;

// for returns
export type T_ReactElementNullable = JSX.Element | null;

// for components as props
export type T_ReactFunctionComponent<G_ComponentProps = T_Object> =
	React.FunctionComponent<G_ComponentProps>;

export type T_ReactRef<G_RefType> = React.RefObject<G_RefType>;

export type T_ReactEffectCallback = React.EffectCallback;

export type T_ReactSetState<G_State> = React.Dispatch<React.SetStateAction<G_State>>;

// --- REACT EVENT HANDLERS ---

export type T_ReactEventTarget = EventTarget;

export type T_ReactOnClickEventObject<G_HTMLElement> = React.MouseEvent<G_HTMLElement>;

export type T_ReactOnClickEventHandler<G_HTMLElement = HTMLButtonElement> =
	React.MouseEventHandler<G_HTMLElement>;

export type T_ReactOnChangeEventObject<G_HTMLElement = HTMLInputElement> =
	React.ChangeEvent<G_HTMLElement>;

export type T_ReactOnChangeEventHandler<G_HTMLElement> = React.ChangeEventHandler<G_HTMLElement>;

export type T_ReactOnFocusEventHandler<G_HTMLElement = HTMLInputElement> =
	React.FocusEventHandler<G_HTMLElement>;

export type T_ReactOnKeyUpEventHandler<G_HTMLElement> = React.KeyboardEventHandler<G_HTMLElement>;

export type T_ReactOnSubmitEventHandler<G_HTMLElement> = React.FormEventHandler<G_HTMLElement>;

// --- HTML ---

export type T_HTMLElementAttributes = JSX.IntrinsicElements;

// --- JS ---

export type T_SetTimeout = NodeJS.Timeout;

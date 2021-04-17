import React, { CSSProperties, EffectCallback, RefObject } from "react";

// --- Primitives ---

export type T_Primitive = string | number | boolean | undefined | null;

export type T_Object<Value = any> = Record<string, Value>;

export type T_Function = () => void;

// --- React ---

export type T_ReactChildrenProp = React.ReactNode;

export type T_ReactStylesProp = CSSProperties;

export type T_ReactElement = JSX.Element | null;

export type T_ReactFunctionComponent<Props = T_Object> = React.FunctionComponent<Props>;

export type T_ReactRefObject<RefType> = RefObject<RefType>;

export type T_ReactForwardedRef = React.ForwardedRef<unknown>;

export type T_ReactEffectCallback = EffectCallback;

// --- HTML/DOM ---

export type T_HTMLAttributes = JSX.IntrinsicElements;

export type T_OnClickEvent<HTMLElement = HTMLButtonElement> = React.MouseEvent<HTMLElement>;

export type T_OnChangeEvent<HTMLElement> = React.ChangeEventHandler<HTMLElement>;

export type T_OnScrollEvent = React.UIEvent<HTMLElement>;

export type T_FormEvent<HTMLElement> = React.FormEvent<HTMLElement>;
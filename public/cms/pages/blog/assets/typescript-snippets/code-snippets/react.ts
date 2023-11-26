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
export type T_ReactFunctionComponent<G_ComponentProps = Record<string, any>> =
	React.FunctionComponent<G_ComponentProps>;

export type T_ReactRef<G_RefType> = React.RefObject<G_RefType>;

export type T_ReactEffectCallback = React.EffectCallback;

export type T_ReactSetState<G_State> = React.Dispatch<React.SetStateAction<G_State>>;

// html native elements props
export type T_HTMLElementAttributes = JSX.IntrinsicElements;

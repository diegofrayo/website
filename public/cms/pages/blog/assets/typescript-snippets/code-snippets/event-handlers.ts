export type T_ReactEventTarget = EventTarget;

export type T_ReactOnClickEventObject<G_HTMLElement> = React.MouseEvent<G_HTMLElement>;

export type T_ReactOnClickEventHandler<G_HTMLElement = HTMLButtonElement> =
	React.MouseEventHandler<G_HTMLElement>;

export type T_ReactOnChangeEventObject<G_HTMLElement = HTMLInputElement> =
	React.ChangeEvent<G_HTMLElement>;

export type T_ReactOnChangeEventHandler<G_HTMLElement> = React.ChangeEventHandler<G_HTMLElement>;

export type T_ReactOnFocusEventHandler<G_HTMLElement = HTMLInputElement> =
	React.FocusEventHandler<G_HTMLElement>;

export type T_ReactOnKeyPressEventHandler<G_HTMLElement> =
	React.KeyboardEventHandler<G_HTMLElement>;

export type T_ReactOnSubmitEventHandler<G_HTMLElement> = React.FormEventHandler<G_HTMLElement>;

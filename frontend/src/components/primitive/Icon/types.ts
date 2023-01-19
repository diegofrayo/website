import { T_ReactElement } from "~/@diegofrayo/library/types/react";

import { ICONS } from "./constants";

export type T_IconName = keyof typeof ICONS;

export type T_Icon = T_ImageIcon | T_LibraryIcon;

export type T_LibraryIcon = {
	icon: (props: React.ComponentProps<"svg">) => T_ReactElement;
	defaultProps: {
		className?: string;
		color?: string;
	};
};

export type T_ImageIcon = {
	icon: string;
	defaultProps: {
		className?: string;
		alt?: string;
	};
};

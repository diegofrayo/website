import cn from "@diegofrayo-pkg/cn";

import { ICONS_PATH } from "~/constants";

import Image from "../../image";
import type { IconProps } from "../icon";

const ImagesAsIcons = {
	AIRBNB: generateIconComponent(`${ICONS_PATH}/airbnb.png`),
	GITHUB: generateIconComponent(`${ICONS_PATH}/github.svg`),
	GMAIL: generateIconComponent(`${ICONS_PATH}/gmail.png`),
	GOOGLE: generateIconComponent(`${ICONS_PATH}/google.svg`),
	INSTAGRAM: generateIconComponent(`${ICONS_PATH}/instagram.svg`),
	LINKEDIN: generateIconComponent(`${ICONS_PATH}/linkedin.svg`),
	MAPS: generateIconComponent(`${ICONS_PATH}/maps.svg`),
	SPOTIFY: generateIconComponent(`${ICONS_PATH}/spotify.svg`),
	WEBSITE: generateIconComponent(`${ICONS_PATH}/website.png`),
	WHATSAPP: generateIconComponent(`${ICONS_PATH}/whatsapp.svg`),
	YOUTUBE: generateIconComponent(`${ICONS_PATH}/youtube.svg`),
};

export default ImagesAsIcons;

//  --- UTILS ---

function generateIconComponent(iconPath: string) {
	const ImageIcon = ({ className, size }: Pick<IconProps, "className" | "size">) => {
		return (
			<Image
				src={iconPath}
				alt="Custom icon"
				className={cn(className)}
				width={size}
				height={size}
				useNativeElement
			/>
		);
	};

	return ImageIcon;
}

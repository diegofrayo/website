import InlineIcons from "./inline-icons";
import * as LibraryIconComponents from "./library-icons";
import RemoteIcons from "./remote-icons";

type LibraryIconsMap = {
	[K in keyof typeof LibraryIconComponents]: {
		icon: (typeof LibraryIconComponents)[K];
		defaultProps: { className: string; color: string };
	};
};

const LibraryIcons = Object.fromEntries(
	Object.entries(LibraryIconComponents).map(([key, icon]) => [
		key,
		{ icon, defaultProps: { className: "", color: "" } },
	]),
) as LibraryIconsMap;

const Icons = { ...InlineIcons, ...RemoteIcons, ...LibraryIcons };

export default Icons;

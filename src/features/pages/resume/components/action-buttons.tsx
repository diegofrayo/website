import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import cn from "@diegofrayo-pkg/cn";

import { Box, Icon } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";
import AnalyticsService from "~/features/analytics";

import type { ContentMode, Design, Lang } from "../resume.types";

type ActionButtonsProps = {
	contentMode: ContentMode;
	design: Design;
	lang: Lang;
	onContentModeChange: (content: ContentMode) => void;
	onDesignChange: (design: Design) => void;
	onLangChange: (lang: Lang) => void;
};

export function ActionButtons({
	contentMode,
	design,
	lang,
	onContentModeChange,
	onDesignChange,
	onLangChange,
}: ActionButtonsProps) {
	// --- STYLES ---
	const classes = {
		container:
			"flex items-center justify-start rounded-full border border-slate-100 bg-white px-1.5 py-1 text-sm font-medium shadow-sm w-full",
		icon: "px-2 text-slate-400",
		toggleGroup: cn("grid min-w-0 flex-1 grid-cols-2 flex-nowrap"),
		toggle:
			"cursor-pointer rounded-full px-3 py-1 text-slate-600 transition-colors data-pressed:bg-slate-900 data-pressed:text-white truncate",
	};

	// --- HANDLERS ---
	function handleDesignChange(newValue: string[]) {
		if (newValue.length > 0) {
			const newMode = newValue[0] as Design;
			onDesignChange(newMode);
			AnalyticsService.trackEvent("RESUME|SET_DESIGN", { view_mode: newMode });
		}
	}

	function handleLangChange(newValue: string[]) {
		if (newValue.length === 0) return;

		const newLang = newValue[0] as Lang;
		onLangChange(newLang);
		AnalyticsService.trackEvent("RESUME|SET_LANG", { lang: newLang });
	}

	function handleContentModeChange(newValue: string[]) {
		if (newValue.length === 0) return;

		const newContentMode = newValue[0] as ContentMode;
		onContentModeChange(newContentMode);
		AnalyticsService.trackEvent("RESUME|SET_CONTENT_MODE", { content_mode: newContentMode });
	}

	return (
		<Box className="@container w-full">
			<Box className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),300px))] justify-center gap-3 sm:grid-cols-3">
				<Box className={classes.container}>
					<Icon
						icon={IconCatalog.PEN_TOOL}
						size={16}
						wrapperClassName={classes.icon}
					/>
					<ToggleGroup
						value={[design]}
						onValueChange={handleDesignChange}
						className={classes.toggleGroup}
					>
						<Toggle
							value="SIMPLE"
							aria-label="Simple design"
							className={classes.toggle}
						>
							Simple
						</Toggle>
						<Toggle
							value="COLORFUL"
							aria-label="Colorful design"
							className={classes.toggle}
						>
							Colorful
						</Toggle>
					</ToggleGroup>
				</Box>

				<Box className={classes.container}>
					<Icon
						icon={IconCatalog.FILE_TEXT}
						size={16}
						wrapperClassName={classes.icon}
					/>
					<ToggleGroup
						value={[contentMode]}
						onValueChange={handleContentModeChange}
						className={classes.toggleGroup}
					>
						<Toggle
							value="SHORT"
							aria-label="Short content"
							className={classes.toggle}
						>
							Short
						</Toggle>
						<Toggle
							value="FULL"
							aria-label="Full content"
							className={classes.toggle}
						>
							Full
						</Toggle>
					</ToggleGroup>
				</Box>

				<Box className={classes.container}>
					<Icon
						icon={IconCatalog.LANGUAGES}
						size={16}
						wrapperClassName={classes.icon}
					/>
					<ToggleGroup
						value={[lang]}
						onValueChange={handleLangChange}
						className={classes.toggleGroup}
					>
						<Toggle
							value="EN"
							aria-label="English"
							className={classes.toggle}
						>
							EN
						</Toggle>
						<Toggle
							value="ES"
							aria-label="Spanish"
							className={classes.toggle}
						>
							ES
						</Toggle>
					</ToggleGroup>
				</Box>
			</Box>
		</Box>
	);
}

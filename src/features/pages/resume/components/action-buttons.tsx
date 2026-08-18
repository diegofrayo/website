import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import cn from "@diegofrayo-pkg/cn";

import { Box, Icon } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";
import AnalyticsService from "~/features/analytics";
import { WithAuth } from "~/features/auth/components";
import { useAuth } from "~/features/auth/hook";

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
	// --- HOOKS ---
	const { isUserLoggedIn } = useAuth();

	// --- STYLES ---
	const classes = {
		mainContainer: cn(
			"grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),300px))] justify-center gap-3 sm:grid-cols-3",
			{ "sm:grid-cols-2": !isUserLoggedIn },
		),
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
		<Box className={classes.mainContainer}>
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
						value="MINIMALIST"
						aria-label="Minimalist design"
						className={classes.toggle}
					>
						Minimalist
					</Toggle>
					<Toggle
						value="STYLISH"
						aria-label="Stylish design"
						className={classes.toggle}
					>
						Stylish
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

			<WithAuth>
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
							value="LONG"
							aria-label="Long content"
							className={classes.toggle}
						>
							Long
						</Toggle>
					</ToggleGroup>
				</Box>
			</WithAuth>
		</Box>
	);
}

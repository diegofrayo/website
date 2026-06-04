import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { flushSync } from "react-dom";

import { useBrowserStorage } from "@diegofrayo-pkg/browser-storage";
import cn from "@diegofrayo-pkg/cn";

import { Box, Button, Icon, InlineText } from "~/components/primitive";
import { IconCatalog } from "~/components/primitive/icon";

import type { ContentMode, Design, DownloadMode, Lang } from "../resume.types";

type DownloadActionsProps = {
	design: Design;
	lang: Lang;
	contentMode: ContentMode;
	onDesignChange: (design: Design) => void;
	onLangChange: (lang: Lang) => void;
	onContentModeChange: (contentMode: ContentMode) => void;
};

export function DownloadActions({
	design,
	lang,
	contentMode,
	onDesignChange,
	onLangChange,
	onContentModeChange,
}: DownloadActionsProps) {
	// --- STATE ---
	const [downloadMode, setDownloadMode] = useBrowserStorage<DownloadMode>({
		key: "DR_RESUME_DOWNLOAD_MODE",
		value: "CURRENT",
		readInitialValueFromStorage: true,
		saveDuringCreation: true,
	});

	// --- STYLES ---
	const classes = {
		radioGroup: "flex gap-5 py-1",
		radioItem: cn("flex cursor-pointer items-center gap-1"),
		radio: cn(
			"m-0 box-border flex size-4 items-center justify-center rounded-full bg-slate-300 p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-unchecked:bg-slate-300",
		),
		indicator: cn(
			"&:data-unchecked:hiddenw flex items-center justify-center before:size-2 before:rounded-full before:bg-slate-700 before:content-['']",
		),
		downloadButton:
			"flex h-full cursor-pointer items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-white ml-2",
		separator: "mx-1.5 h-5 w-px border-slate-200",
	};

	// --- HANDLERS ---
	function handleDownloadClick() {
		if (downloadMode === "CURRENT") {
			window.print();
		} else {
			downloadAll();
		}
	}

	// --- UTILS ---
	function downloadAll() {
		const originalDesign = design;
		const originalLang = lang;
		const originalContentMode = contentMode;
		const originalTitle = document.title;
		const variants: Array<{ lang: Lang; design: Design; contentMode: ContentMode }> = [
			{ design: "SIMPLE", contentMode: "SHORT", lang: "EN" },
			{ design: "SIMPLE", contentMode: "SHORT", lang: "ES" },
			{ design: "SIMPLE", contentMode: "FULL", lang: "EN" },
			{ design: "SIMPLE", contentMode: "FULL", lang: "ES" },
			{ design: "COLORFUL", contentMode: "SHORT", lang: "EN" },
			{ design: "COLORFUL", contentMode: "SHORT", lang: "ES" },
			{ design: "COLORFUL", contentMode: "FULL", lang: "EN" },
			{ design: "COLORFUL", contentMode: "FULL", lang: "ES" },
		];

		let index = 0;

		const triggerPrint = (lang: Lang, design: Design, contentMode: ContentMode) => {
			const isDefaultResume = lang === "EN" && design === "SIMPLE" && contentMode === "SHORT";
			document.title = isDefaultResume
				? "2026"
				: `2026 - ${contentMode} - ${lang} - ${design}`.toUpperCase();
			window.print();
		};

		const printNext = () => {
			if (index >= variants.length) {
				document.title = originalTitle;
				onDesignChange(originalDesign);
				onLangChange(originalLang);
				onContentModeChange(originalContentMode);
				return;
			}

			const variant = variants[index++];

			flushSync(() => {
				onDesignChange(variant.design);
				onLangChange(variant.lang);
			});

			setTimeout(() => {
				window.addEventListener("afterprint", printNext, { once: true });
				triggerPrint(variant.lang, variant.design, variant.contentMode);
			}, 1000);
		};

		printNext();
	}

	return (
		<Box className="flex justify-center">
			<Box className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-1.5 py-1 text-sm font-medium shadow-sm">
				<Icon
					icon={IconCatalog.DOWNLOAD}
					size={16}
					wrapperClassName="px-2 text-slate-400"
				/>

				<RadioGroup
					value={downloadMode}
					onValueChange={(val) => setDownloadMode(val as DownloadMode)}
					className={classes.radioGroup}
				>
					<label className={classes.radioItem}>
						<Radio.Root
							value="CURRENT"
							aria-label="Download current variant"
							className={classes.radio}
						>
							<Radio.Indicator className={classes.indicator} />
						</Radio.Root>
						<InlineText>Current</InlineText>
					</label>

					<label className={classes.radioItem}>
						<Radio.Root
							value="ALL"
							aria-label="Download all variants"
							className={classes.radio}
						>
							<Radio.Indicator className={classes.indicator} />
						</Radio.Root>
						<InlineText>All</InlineText>
					</label>
				</RadioGroup>

				<Button
					variant={Button.variant.SMOOTH}
					className={classes.downloadButton}
					onClick={handleDownloadClick}
				>
					<InlineText>Download</InlineText>
				</Button>
			</Box>
		</Box>
	);
}

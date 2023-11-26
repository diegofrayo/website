import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Link, Space, Input, Text, InlineText, Block } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { I18nService, useTranslation } from "~/features/i18n";
import { ROUTES } from "~/features/routing";
import { useDidMount } from "~/hooks";
import v from "~/lib/v";
import { focusElement } from "~/utils/browser";
import { removeAccents } from "~/utils/strings";
import type { T_ReactElement, T_ReactOnChangeEventHandler, T_ReactRef } from "~/types";

import { SongDetails } from "./components";
import { T_Song } from "./service";

function MusicPage({ data }: { data: T_Song[] }): T_ReactElement {
	const {
		// --- STATES & REFS ---
		inputValue,
		inputRef,

		// --- HANDLERS ---
		onInputChangeHandler,

		// --- UTILS ---
		parseData,
	} = useController();
	const { t } = useTranslation();

	const { chordsPage, songsList } = parseData(data);

	return (
		<Page
			config={{
				title: t("page:title"),
				pathname: ROUTES.MUSIC,
				description: t("page:description"),
				disableSEO: Boolean(t("page:config:is_seo_disabled")),
			}}
		>
			<MainLayout title={t("page:title")}>
				<Block>
					<Block variant="FEATURED">
						<Emoji className="tw-mr-2">⭐</Emoji>
						<Link
							variant={Link.variant.PRIMARY}
							href={`${ROUTES.MUSIC}/${chordsPage.id}`}
							locale={I18nService.getDefaultLocale()}
						>
							<InlineText className="tw-underline">{t("page:chords_title")}</InlineText>
						</Link>
					</Block>
					<Space
						size={6}
						variant={Space.variant.DASHED}
					/>

					<Block variant="FEATURED">
						<Block>
							<Input
								componentProps={{ label: t("page:input_label") }}
								id="input"
								type="search"
								placeholder={t("page:input_placeholder")}
								value={inputValue}
								autoComplete="off"
								ref={inputRef}
								onChange={onInputChangeHandler}
							/>
							<Text className="tw-mt-1 tw-text-right tw-text-xs tw-font-bold">
								{t("page:results_title")} [{songsList.length}]
							</Text>
						</Block>
						<Space size={2} />

						<Block className="tw-flex tw-flex-wrap tw-justify-between">
							{songsList.map((song) => {
								return (
									<Block
										key={song.id}
										className="tw-mb-6 tw-w-full sm:tw-w-5/12"
									>
										<Link
											variant={Link.variant.PRIMARY}
											href={`${ROUTES.MUSIC}/${song.id}`}
											className={classNames(
												"tw-block sm:tw-truncate",
												v.isNotTrue(song.isPublic) && "tw-line-through",
											)}
											title={song.title}
										>
											{song.title}
										</Link>
										<SongDetails song={song} />
									</Block>
								);
							})}
						</Block>
					</Block>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default MusicPage;

// --- CONTROLLER ---

type T_UseController = {
	inputValue: string;
	inputRef: T_ReactRef<HTMLInputElement>;
	onInputChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
	parseData: (songs: T_Song[]) => {
		chordsPage: T_Song;
		songsList: T_Song[];
	};
};

function useController(): T_UseController {
	// --- STATES & REFS ---
	const [inputValue, setInputValue] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	// --- EFFECTS ---
	useDidMount(() => {
		const controller = new AbortController();

		document.addEventListener(
			"keydown",
			function focusInputAndSelectText(event: KeyboardEvent): void {
				if (
					v.isNull(inputRef.current) ||
					v.isNotEquals(event.code, "KeyF") ||
					v.isFalsy(event.metaKey || event.ctrlKey)
				) {
					return;
				}

				event.preventDefault();
				focusElement(inputRef.current);
			},
			{ signal: controller.signal },
		);

		return () => {
			controller.abort();
		};
	});

	// --- HANDLERS ---
	const onInputChangeHandler: T_UseController["onInputChangeHandler"] =
		function onInputChangeHandler(event) {
			setInputValue(event.currentTarget.value.toLowerCase());
		};

	// --- UTILS ---
	const parseData: T_UseController["parseData"] = function parseData(songs) {
		return {
			chordsPage: songs[0],
			songsList: songs.slice(1).filter((song) => {
				return (
					removeAccents(song.title).toLowerCase().includes(inputValue) ||
					removeAccents(song.artist).toLowerCase().includes(inputValue)
				);
			}),
		};
	};

	return {
		// --- STATES & REFS ---
		inputValue,
		inputRef,

		// --- HANDLERS ---
		onInputChangeHandler,

		// --- UTILS ---
		parseData,
	};
}

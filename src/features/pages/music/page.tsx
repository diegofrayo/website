import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Link, Space, Input, Text, InlineText, Block } from "~/components/primitive";
import { Render, Emoji } from "~/components/shared";
import { useDidMount, useQuery } from "~/hooks";
import { I18nService, useTranslation } from "~/features/i18n";
import { focusElement, showToast } from "~/utils/browser";
import { ROUTES } from "~/features/routing";
import { removeAccents } from "~/utils/strings";
import { isNotTrue, isFalsy, isNotEquals, isNull } from "~/utils/validations";
import type { T_ReactElement, T_ReactOnChangeEventHandler, T_ReactRefObject } from "~/types";

import { SongDetails } from "./components";
import MusicService, { T_Song } from "./service";

function MusicPage(): T_ReactElement {
	const {
		// states
		inputValue,
		inputRef,

		// vars
		isLoading,
		error,
		data,

		// handlers
		onInputChangeHandler,

		// utils
		parseData,
	} = useController();
	const { t } = useTranslation();

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
				<Render
					isLoading={isLoading}
					error={error}
					data={data}
				>
					{(data): T_ReactElement => {
						const { chordsPage, songsList } = parseData(data);

						return (
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
															isNotTrue(song.isPublic) && "tw-line-through",
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
						);
					}}
				</Render>
			</MainLayout>
		</Page>
	);
}

export default MusicPage;

// --- Controller ---

type T_UseController = {
	inputValue: string;
	inputRef: T_ReactRefObject<HTMLInputElement>;
	isLoading: boolean;
	error: unknown;
	data: T_Song[] | undefined;
	onInputChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
	parseData: (songs: T_Song[]) => {
		chordsPage: T_Song;
		songsList: T_Song[];
	};
};

function useController(): T_UseController {
	// hooks
	const { isLoading, error, data } = useQuery("music", async () => {
		const LOCAL_STORAGE_KEY = "DFR_MUSIC_DATA";

		try {
			const data = await MusicService.fetchSongs();

			window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

			return data;
		} catch (e) {
			const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);

			if (data) {
				showToast({ type: "ALERT", message: "Data loaded from localStorage" });
				return JSON.parse(data);
			}

			throw e;
		}
	});

	// states & refs
	const [inputValue, setInputValue] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	// effects
	useDidMount(() => {
		const controller = new AbortController();

		document.addEventListener(
			"keydown",
			function focusInputAndSelectText(event: KeyboardEvent): void {
				if (
					isNull(inputRef.current) ||
					isNotEquals(event.code, "KeyF") ||
					isFalsy(event.metaKey || event.ctrlKey)
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

	// handlers
	const onInputChangeHandler: T_UseController["onInputChangeHandler"] =
		function onInputChangeHandler(event) {
			setInputValue(event.currentTarget.value.toLowerCase());
		};

	// utils
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
		// states
		inputValue,
		inputRef,

		// vars
		isLoading,
		error,
		data,

		// handlers
		onInputChangeHandler,

		// utils
		parseData,
	};
}

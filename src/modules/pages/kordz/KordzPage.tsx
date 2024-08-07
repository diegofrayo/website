import * as React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Link, Space, Input, Text, InlineText, Block } from "~/components/primitive";
import { ClientRenderComponent } from "~/hocs";
import { AuthService } from "~/modules/auth";
import { ROUTES } from "~/modules/routing";
import type { T_PageContent } from "~/server/data-loader";
import { useDidMount } from "@diegofrayo/hooks";
import type DR from "@diegofrayo/types";
import type { T_Song } from "@diegofrayo/types/kordz";
import { focusElement } from "@diegofrayo/utils/browser";
import { removeAccents } from "@diegofrayo/utils/strings";
import v from "@diegofrayo/v";

import SongDetails from "./components/SongDetails";

export type T_KordzPageProps = {
	cmsContent: T_PageContent;
	data: T_Song[];
};

function KordzPage({ cmsContent, data }: T_KordzPageProps) {
	// --- STATES & REFS ---
	const [inputValue, setInputValue] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [filteredData, setFilteredData] = React.useState<T_KordzPageProps["data"]>([data[0]]);
	const { chordsPage, songsList } = parseData(filteredData);

	// --- EFFECTS ---
	useDidMount(() => {
		initialDataFiltering();

		const controller = new AbortController();
		document.addEventListener(
			"keydown",
			function focusInputAndSelectText(event: KeyboardEvent) {
				if (
					v.isNull(inputRef.current) ||
					v.isNotEqual(event.code, "KeyF") ||
					v.isFalse(event.metaKey || event.ctrlKey)
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
	function onInputChangeHandler(event: DR.React.Events.OnChangeEvent<HTMLInputElement>) {
		setInputValue(event.currentTarget.value.toLowerCase());
	}

	// --- UTILS ---
	function parseData(songs: T_KordzPageProps["data"]) {
		return {
			chordsPage: songs[0],
			songsList: inputValue
				? songs.slice(1).filter((song) => {
						return (
							removeAccents(song.title).toLowerCase().includes(inputValue) ||
							removeAccents(song.artist).toLowerCase().includes(inputValue)
						);
					})
				: songs.slice(1),
		};
	}

	function initialDataFiltering() {
		setFilteredData(
			data.filter((song) => {
				if (AuthService.isGuestUser() && !song.is_public) {
					return false;
				}

				return true;
			}),
		);
	}

	return (
		<Page
			config={{
				title: cmsContent.content.seo.title,
				description: cmsContent.content.seo.description,
				disableSEO: cmsContent.config.is_seo_enabled === false,
				pathname: cmsContent.config.pathname,
			}}
		>
			<MainLayout title={cmsContent.content.seo.title}>
				<Block>
					<Block>
						<InlineText className="tw-mr-2">⭐</InlineText>
						<Link
							variant={Link.variant.STYLED}
							href={`${ROUTES.KORDZ}/${chordsPage.id}`}
						>
							<InlineText className="tw-underline">{chordsPage.title}</InlineText>
						</Link>
					</Block>
					<Space
						size={6}
						variant={Space.variant.DASHED}
					/>

					<Block>
						<Block>
							<Input
								variant={Input.variant.STYLED}
								componentProps={{ label: "Buscar" }}
								id="input"
								type="search"
								placeholder="Ingresa un título o artista"
								value={inputValue}
								autoComplete="off"
								ref={inputRef}
								onChange={onInputChangeHandler}
							/>
							<Text className="tw-mt-1 tw-text-right tw-text-xs tw-font-bold">
								Resultados [{songsList.length}]
							</Text>
						</Block>
						<Space size={2} />

						<ClientRenderComponent>
							<Block className="tw-flex tw-flex-wrap tw-justify-between">
								{songsList.map((song) => {
									return (
										<Block
											key={song.id}
											className="tw-mb-6 tw-w-full sm:tw-w-5/12"
										>
											<Link
												variant={Link.variant.STYLED}
												href={`${ROUTES.KORDZ}/${song.id}`}
												className="tw-block sm:tw-truncate"
												title={song.title}
											>
												{song.title}
											</Link>
											<SongDetails song={song} />
										</Block>
									);
								})}
							</Block>
						</ClientRenderComponent>
					</Block>
				</Block>
			</MainLayout>
		</Page>
	);
}

export default KordzPage;

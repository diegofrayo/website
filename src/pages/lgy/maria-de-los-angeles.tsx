// @ts-nocheck

import React, { useState, Fragment } from "react";
import { useTheme } from "next-themes";

import { Page } from "~/components/layout";
import { Icon, Link } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { useDidMount } from "~/hooks";
import twcss from "~/lib/twcss";
import { T_Object, T_ReactElement } from "~/types";
import { setScrollPosition } from "~/utils/browser";

declare global {
	interface I_Window {
		$: T_Object;
	}
}

function MariaPage(): T_ReactElement {
	// hooks
	const { theme, setTheme } = useTheme();

	// states & refs
	const [section, setSection] = useState("");

	// effects
	useDidMount(() => {
		if (theme === "dark") setTheme("light");
	});

	return (
		<Page
			config={{
				title: "Maria de los angeles",
				disableSEO: true,
			}}
		>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" />
			<main className="dfr-max-w-base tw-mx-auto tw-h-full tw-w-full md:tw-shadow-md">
				<header className="tw-bg-blue-100 tw-py-3 tw-px-4">
					<h1 className="tw-text-xl tw-text-blue-900 sm:tw-text-3xl">
						<Emoji className="tw-mr-2">💃</Emoji> <span>Bienvenida a María App</span>
					</h1>
				</header>

				<section className="tw-py-8 tw-px-4">
					{section ? (
						<Fragment>
							<div
								className="tw-mb-8 tw-cursor-pointer tw-font-bold"
								onClick={() => setSection("")}
							>
								<Emoji className="tw-mr-3">⬅️</Emoji>
								<span>Volver atrás</span>
							</div>
							<div>
								{section === "WHATSAPP" ? (
									<Fragment>En progreso...</Fragment>
								) : section === "YOUTUBE" ? (
									<YouTube />
								) : section === "BIBLE" ? (
									<Bible />
								) : null}
							</div>
						</Fragment>
					) : (
						<Fragment>
							<h2 className="tw-mb-6 tw-text-center tw-text-xl">Elije una opción 🙋‍♀️</h2>

							<div className="tw-flex tw-flex-wrap tw-justify-evenly">
								<MenuItem
									onClick={() => {
										window.open(
											"https://api.whatsapp.com/send?phone=573113728898&text=Hola Diego ⚡",
										);
									}}
								>
									<Icon
										icon={Icon.icon.WHATSAPP}
										wrapperClassName="tw-mx-auto tw-mb-2"
										size={48}
									/>
									<p className="tw-mt-2 tw-text-center tw-text-lg tw-font-bold">
										Enviar mensaje a un amigo
									</p>
								</MenuItem>
								<MenuItem
									onClick={() => {
										setSection("YOUTUBE");
										setScrollPosition(0);
									}}
								>
									<Icon
										icon={Icon.icon.YOUTUBE}
										wrapperClassName="tw-mx-auto tw-mb-2"
										size={48}
									/>
									<p className="tw-mt-2 tw-text-center tw-text-lg tw-font-bold">
										Escuchar música favorita en YouTube
									</p>
								</MenuItem>
								<MenuItem
									onClick={() => {
										setSection("BIBLE");
										setScrollPosition(0);
									}}
								>
									<Emoji className="tw-text-5xl">📖</Emoji>
									<p className="tw-mt-2 tw-text-center tw-text-lg tw-font-bold">
										Versículo del día
									</p>
								</MenuItem>
								<MenuItem
									onClick={() => {
										alert("Diego te quiere mucho");
									}}
								>
									<Emoji className="tw-text-center tw-text-5xl">⚡</Emoji>
								</MenuItem>
							</div>
						</Fragment>
					)}
				</section>
			</main>
		</Page>
	);
}

export default MariaPage;

// --- Components ---

const MenuItem = twcss.div`tw-cursor-pointer tw-m-2 tw-h-64 tw-w-64 tw-border tw-rounded-md tw-flex tw-items-center tw-justify-center tw-flex-col tw-p-4 tw-max-w-full`;

function YouTube() {
	const PLAYLISTS = [
		{
			name: "🙏☀️",
			url: "https://www.youtube.com/playlist?list=PLggewE8gQHKqhV48ggHU3GqItQ_fQaRUf",
		},
		{
			name: "🕺💃",
			url: "https://www.youtube.com/playlist?list=PLggewE8gQHKpgBFZgMOAoKX9vBByk5wRb",
		},
		{
			name: "💛🎼",
			url: "https://www.youtube.com/playlist?list=PLggewE8gQHKogTIFnxtQVzKjd5jz_xEKC",
		},
		{
			name: "😌💖🙋",
			url: "https://www.youtube.com/playlist?list=PLggewE8gQHKqhJ4pJpksMGHBGNO_W1OCt",
		},
	];

	return (
		<section>
			<h2 className="tw-mb-4 tw-text-3xl">🎶 ¿Que quieres escuchar?</h2>

			<div className="tw-flex tw-flex-wrap tw-justify-evenly">
				{PLAYLISTS.map((playlist, index) => {
					return (
						<Link
							key={`Playlist-${index}`}
							href={playlist.url}
							variant={Link.variant.SIMPLE}
						>
							<MenuItem>
								<Emoji className="tw-text-5xl">{playlist.name}</Emoji>
							</MenuItem>
						</Link>
					);
				})}
			</div>
		</section>
	);
}

function Bible() {
	const [content, setContent] = useState("Cargando...");

	useDidMount(() => {
		// https://dailyverses.net/es/ley
		const ITEMS = [
			{
				text: "Cumple los mandamientos del Señor tu Dios; témelo y sigue sus caminos.",
				source: "Deuteronomio 8:6",
			},
			{
				text: "Grábate en el corazón estas palabras que hoy te mando. Incúlcaselas continuamente a tus hijos. Háblales de ellas cuando estés en tu casa y cuando vayas por el camino, cuando te acuestes y cuando te levantes.",
				source: "Deuteronomio 6:6-7",
			},
		];

		setTimeout(() => {
			const item = ITEMS[new Date().getDate() % 2 === 0 ? 1 : 0];
			setContent(item.text + "<br>" + `<b>${item.source}</b>`);
		}, 1000);
	});

	return (
		<div className="root">
			<div
				dangerouslySetInnerHTML={{
					__html: content,
				}}
			/>

			<style jsx>{`
				.root :global(a) {
					@apply dfr-links-inv;
					@apply tw-mt-2;
					font-weight: bold;
				}
			`}</style>
		</div>
	);
}

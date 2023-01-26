if (!self.define) {
	let e,
		s = {};
	const i = (i, c) => (
		(i = new URL(i + ".js", c).href),
		s[i] ||
			new Promise((s) => {
				if ("document" in self) {
					const e = document.createElement("script");
					(e.src = i), (e.onload = s), document.head.appendChild(e);
				} else (e = i), importScripts(i), s();
			}).then(() => {
				let e = s[i];
				if (!e) throw new Error(`Module ${i} didn’t register its module`);
				return e;
			})
	);
	self.define = (c, a) => {
		const t = e || ("document" in self ? document.currentScript.src : "") || location.href;
		if (s[t]) return;
		let n = {};
		const r = (e) => i(e, t),
			d = { module: { uri: t }, exports: n, require: r };
		s[t] = Promise.all(c.map((e) => d[e] || r(e))).then((e) => (a(...e), n));
	};
}
define(["./workbox-6316bd60"], function (e) {
	"use strict";
	importScripts(),
		self.skipWaiting(),
		e.clientsClaim(),
		e.precacheAndRoute(
			[
				{
					url: "/_next/static/MNdXCzFAfK6fGHov0M2tp/_buildManifest.js",
					revision: "883e2649e2ed3cbfca76783a5fa87c82",
				},
				{
					url: "/_next/static/MNdXCzFAfK6fGHov0M2tp/_ssgManifest.js",
					revision: "b6652df95db52feb4daf4eca35380933",
				},
				{ url: "/_next/static/chunks/109.ae8c4e557eccc2a4.js", revision: "ae8c4e557eccc2a4" },
				{ url: "/_next/static/chunks/173.a36c8d738858a803.js", revision: "a36c8d738858a803" },
				{ url: "/_next/static/chunks/175.0d70b64fdd6737da.js", revision: "0d70b64fdd6737da" },
				{ url: "/_next/static/chunks/306.8a610bbb90668bdb.js", revision: "8a610bbb90668bdb" },
				{ url: "/_next/static/chunks/354.71be8cf0d0c71917.js", revision: "71be8cf0d0c71917" },
				{ url: "/_next/static/chunks/445.bd248e0caee93a9b.js", revision: "bd248e0caee93a9b" },
				{ url: "/_next/static/chunks/480.31d4fe8b3cfe4caa.js", revision: "31d4fe8b3cfe4caa" },
				{ url: "/_next/static/chunks/569.07c32655d9d25558.js", revision: "07c32655d9d25558" },
				{ url: "/_next/static/chunks/575.26064d64ef4d3a2b.js", revision: "26064d64ef4d3a2b" },
				{ url: "/_next/static/chunks/583.77394f57a9c13231.js", revision: "77394f57a9c13231" },
				{ url: "/_next/static/chunks/636.b4c72570d8dcf3f7.js", revision: "b4c72570d8dcf3f7" },
				{ url: "/_next/static/chunks/641.f336b63b25c30c65.js", revision: "f336b63b25c30c65" },
				{ url: "/_next/static/chunks/651.bd3ee586694c39ed.js", revision: "bd3ee586694c39ed" },
				{ url: "/_next/static/chunks/692.483e3ee253cd4ffd.js", revision: "483e3ee253cd4ffd" },
				{ url: "/_next/static/chunks/727.5bba2ad13f986e62.js", revision: "5bba2ad13f986e62" },
				{ url: "/_next/static/chunks/741.3142412ed8153c2c.js", revision: "3142412ed8153c2c" },
				{ url: "/_next/static/chunks/764.03b5d5707ebb9947.js", revision: "03b5d5707ebb9947" },
				{ url: "/_next/static/chunks/765.3d2d0fb91a19a71a.js", revision: "3d2d0fb91a19a71a" },
				{ url: "/_next/static/chunks/834.7d2335c208f455e7.js", revision: "7d2335c208f455e7" },
				{ url: "/_next/static/chunks/859.e2a980bebc7e69b6.js", revision: "e2a980bebc7e69b6" },
				{ url: "/_next/static/chunks/879-7833faf50d3da3d3.js", revision: "7833faf50d3da3d3" },
				{ url: "/_next/static/chunks/913.043935587313fc1d.js", revision: "043935587313fc1d" },
				{ url: "/_next/static/chunks/94.89696f36e8900557.js", revision: "89696f36e8900557" },
				{ url: "/_next/static/chunks/975.fd1577f7de55c17b.js", revision: "fd1577f7de55c17b" },
				{ url: "/_next/static/chunks/996.cfe3c4897dc44c60.js", revision: "cfe3c4897dc44c60" },
				{ url: "/_next/static/chunks/framework-5f4595e5518b5600.js", revision: "5f4595e5518b5600" },
				{ url: "/_next/static/chunks/main-c44bd5ccfe3a849b.js", revision: "c44bd5ccfe3a849b" },
				{ url: "/_next/static/chunks/pages/404-69be068cf57bd908.js", revision: "69be068cf57bd908" },
				{ url: "/_next/static/chunks/pages/500-6b7e95486c09b6ba.js", revision: "6b7e95486c09b6ba" },
				{
					url: "/_next/static/chunks/pages/_app-8f1e7c7849cb6ca1.js",
					revision: "8f1e7c7849cb6ca1",
				},
				{
					url: "/_next/static/chunks/pages/_error-1a5ee65903ffb785.js",
					revision: "1a5ee65903ffb785",
				},
				{
					url: "/_next/static/chunks/pages/about-me-7c8eb15b56d5cd2b.js",
					revision: "7c8eb15b56d5cd2b",
				},
				{
					url: "/_next/static/chunks/pages/blog-30860596375a658b.js",
					revision: "30860596375a658b",
				},
				{
					url: "/_next/static/chunks/pages/blog/%5Bslug%5D-0022059466676c23.js",
					revision: "0022059466676c23",
				},
				{
					url: "/_next/static/chunks/pages/index-fab907bb645f312f.js",
					revision: "fab907bb645f312f",
				},
				{
					url: "/_next/static/chunks/pages/lgy/maria-camila-734d5958e9455a83.js",
					revision: "734d5958e9455a83",
				},
				{
					url: "/_next/static/chunks/pages/lgy/maria-de-los-angeles-bb04614880d90c07.js",
					revision: "bb04614880d90c07",
				},
				{
					url: "/_next/static/chunks/pages/music-ed3b0d3ca04ac15e.js",
					revision: "ed3b0d3ca04ac15e",
				},
				{
					url: "/_next/static/chunks/pages/music/%5Bsong%5D-ffa4ed2c61b52672.js",
					revision: "ffa4ed2c61b52672",
				},
				{
					url: "/_next/static/chunks/pages/personal-27d228dc5f8c17e1.js",
					revision: "27d228dc5f8c17e1",
				},
				{
					url: "/_next/static/chunks/pages/personal/%5Bpage%5D-ad827e09da7c0572.js",
					revision: "ad827e09da7c0572",
				},
				{
					url: "/_next/static/chunks/pages/personal/contacts-93406947e237101b.js",
					revision: "93406947e237101b",
				},
				{
					url: "/_next/static/chunks/pages/personal/timer-6dbb51759e78edfc.js",
					revision: "6dbb51759e78edfc",
				},
				{
					url: "/_next/static/chunks/pages/readings-8e7377d33fb4affc.js",
					revision: "8e7377d33fb4affc",
				},
				{
					url: "/_next/static/chunks/pages/resume-6d7e207c6e643da5.js",
					revision: "6d7e207c6e643da5",
				},
				{
					url: "/_next/static/chunks/pages/sign-in-a1c167155f1ac262.js",
					revision: "a1c167155f1ac262",
				},
				{
					url: "/_next/static/chunks/pages/sign-out-6b99556794a922d3.js",
					revision: "6b99556794a922d3",
				},
				{
					url: "/_next/static/chunks/polyfills-0d1b80a048d4787e.js",
					revision: "40ccea369337cec877151c906f22814d",
				},
				{ url: "/_next/static/chunks/webpack-9c4cd7d4268fe21e.js", revision: "9c4cd7d4268fe21e" },
				{ url: "/_next/static/css/70882e3e5e646bd5.css", revision: "70882e3e5e646bd5" },
				{ url: "/atom.xml", revision: "630394abf2cc7fab6d6b9fe51711c11a" },
				{ url: "/feed.json", revision: "90d68e58571db3cd002dd192555b0e1e" },
				{ url: "/robots.txt", revision: "c0c3c98a609ff98382758d8d9ac9608a" },
				{ url: "/rss.xml", revision: "149e80e8dceff3f6943594704f3c477e" },
				{ url: "/site.webmanifest", revision: "e7b6f21144f4ce2664cdab435b47826c" },
				{ url: "/sitemap.xml", revision: "99532dc326a3e3cc9948ed716c3b69cf" },
				{
					url: "/static/images/favicon/android-chrome-192x192.png",
					revision: "0b9ee2f62528da6701fc2a36dfee5fc9",
				},
				{
					url: "/static/images/favicon/android-chrome-512x512.png",
					revision: "2d49a7cd50ca5e5b17b162262ecefa81",
				},
				{
					url: "/static/images/favicon/apple-touch-icon.png",
					revision: "c16500e45539cdacc146a35d4ef56b34",
				},
				{
					url: "/static/images/favicon/favicon-16x16.png",
					revision: "1f63b47a6f7b9002bce77244d8416633",
				},
				{
					url: "/static/images/favicon/favicon-32x32.png",
					revision: "a972f76ba85d3711b567e3d8b9463ff1",
				},
				{
					url: "/static/images/favicon/favicon-dev.ico",
					revision: "ffb520bac623d4c5b56dbc74b93337b6",
				},
				{ url: "/static/images/favicon/favicon.ico", revision: "78955c3f384a476d6d133aee6d5db4f7" },
				{ url: "/static/images/icons/500px.svg", revision: "419bcaae0d0686f51680c0a030210888" },
				{
					url: "/static/images/icons/couchsurfing.png",
					revision: "74de53bbec1734130e474ed822763a98",
				},
				{ url: "/static/images/icons/flower-1.svg", revision: "98f9492756c2a6671b9f2606a056fd6d" },
				{ url: "/static/images/icons/flower-2.svg", revision: "dfbeb98bdcf568cb090818479be1b92c" },
				{ url: "/static/images/icons/flower-3.svg", revision: "7f3a6e183537f69b9042776b2f8e35d8" },
				{
					url: "/static/images/icons/github-light.svg",
					revision: "b78664f6e4d84eb6ec0feb957305d93b",
				},
				{ url: "/static/images/icons/github.svg", revision: "5762a8ff32510100b752a300a01a4344" },
				{ url: "/static/images/icons/gmail.svg", revision: "d0915bc3877280aee83c4d1cd3bc3856" },
				{ url: "/static/images/icons/guitar.svg", revision: "47af7f5133daa4a842c5b115ce59029b" },
				{ url: "/static/images/icons/instagram.svg", revision: "565d46740994e08aedb941f7e17c3091" },
				{ url: "/static/images/icons/linkedin.svg", revision: "96141e3d7bf7d0d570717cb15172dc19" },
				{ url: "/static/images/icons/netflix.svg", revision: "77c5ae8124a31add8ef9e28505601dcf" },
				{ url: "/static/images/icons/soccer.svg", revision: "b56aa658da349cfb693a5c689cdfb2cb" },
				{ url: "/static/images/icons/spotify.svg", revision: "50ec4d84de7e088997c9c501267c5392" },
				{ url: "/static/images/icons/twitter.svg", revision: "7a4d9f0fe157437d3258bbc3b785066d" },
				{ url: "/static/images/icons/whatsapp.svg", revision: "c4286b3958198898d81dafe7c6ccef78" },
				{ url: "/static/images/icons/youtube.svg", revision: "e5bf5a0cff4386700bc59167f9815a76" },
				{ url: "/static/images/meta-og-image.png", revision: "f7cc54cc769f903f063ffad074240ccf" },
				{
					url: "/static/images/misc/amazon-prime-video.png",
					revision: "c98ea7578d4a0b6448195766b40f7aea",
				},
				{ url: "/static/images/misc/imdb.png", revision: "72f032917d44f3c67d4365aa64872e7a" },
				{ url: "/static/images/misc/lacuerda.png", revision: "fe8cbcc7c569e2dd5d8fd3a323a487a3" },
				{
					url: "/static/images/pages/home/about-me.png",
					revision: "9d915965c3904fb8dab0857b4dd8c042",
				},
				{
					url: "/static/images/pages/home/separator-dark.svg",
					revision: "11ebff0ff5c22e576a335f52a05199fa",
				},
				{
					url: "/static/images/pages/home/separator.svg",
					revision: "23555076f81c05304172ae4290e942b5",
				},
				{
					url: "/static/images/pages/personal/thumbnails/code-1.png",
					revision: "17126629d10700cb367cfe5f13fa4972",
				},
				{
					url: "/static/images/pages/personal/thumbnails/code-2.png",
					revision: "52864ee1b9686c6b3a40b0e247336994",
				},
				{
					url: "/static/images/textures/arabesque.png",
					revision: "f89011aaba94ef0702e2a20724b7af84",
				},
				{
					url: "/static/images/textures/cream-pixels.png",
					revision: "ae94bed3136daa6ce7b0b1a067564d2a",
				},
				{
					url: "/static/images/textures/dark-stripes.png",
					revision: "1ad02f0c79d640803541c1bdba9d55cb",
				},
				{
					url: "/static/images/textures/diamond-eyes.png",
					revision: "69983bfcc1b1618e2846034f7c4bbb94",
				},
				{
					url: "/static/sounds/timer/clock-tick.mp3",
					revision: "eb36f83ee627e46dedbd5d05e57d70bd",
				},
				{
					url: "/static/sounds/timer/routine-item-completed.mp3",
					revision: "2a60fc52e06b72048944f904803f6d60",
				},
				{
					url: "/static/sounds/timer/set-completed.mp3",
					revision: "09b682ef31b2b7e66628e21923233176",
				},
			],
			{ ignoreURLParametersMatching: [] },
		),
		e.cleanupOutdatedCaches(),
		e.registerRoute(
			"/",
			new e.NetworkFirst({
				cacheName: "start-url",
				plugins: [
					{
						cacheWillUpdate: async ({ request: e, response: s, event: i, state: c }) =>
							s && "opaqueredirect" === s.type
								? new Response(s.body, { status: 200, statusText: "OK", headers: s.headers })
								: s,
					},
				],
			}),
			"GET",
		),
		e.registerRoute(
			/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
			new e.CacheFirst({
				cacheName: "google-fonts-webfonts",
				plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
			}),
			"GET",
		),
		e.registerRoute(
			/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
			new e.StaleWhileRevalidate({
				cacheName: "google-fonts-stylesheets",
				plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
			new e.StaleWhileRevalidate({
				cacheName: "static-font-assets",
				plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
			new e.StaleWhileRevalidate({
				cacheName: "static-image-assets",
				plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			/\/_next\/image\?url=.+$/i,
			new e.StaleWhileRevalidate({
				cacheName: "next-image",
				plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(?:mp3|wav|ogg)$/i,
			new e.CacheFirst({
				cacheName: "static-audio-assets",
				plugins: [
					new e.RangeRequestsPlugin(),
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(?:mp4)$/i,
			new e.CacheFirst({
				cacheName: "static-video-assets",
				plugins: [
					new e.RangeRequestsPlugin(),
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(?:js)$/i,
			new e.StaleWhileRevalidate({
				cacheName: "static-js-assets",
				plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(?:css|less)$/i,
			new e.StaleWhileRevalidate({
				cacheName: "static-style-assets",
				plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			/\/_next\/data\/.+\/.+\.json$/i,
			new e.StaleWhileRevalidate({
				cacheName: "next-data",
				plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(?:json|xml|csv)$/i,
			new e.NetworkFirst({
				cacheName: "static-data-assets",
				plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			({ url: e }) => {
				if (!(self.origin === e.origin)) return !1;
				const s = e.pathname;
				return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
			},
			new e.NetworkFirst({
				cacheName: "apis",
				networkTimeoutSeconds: 10,
				plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			({ url: e }) => {
				if (!(self.origin === e.origin)) return !1;
				return !e.pathname.startsWith("/api/");
			},
			new e.NetworkFirst({
				cacheName: "others",
				networkTimeoutSeconds: 10,
				plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
			}),
			"GET",
		),
		e.registerRoute(
			({ url: e }) => !(self.origin === e.origin),
			new e.NetworkFirst({
				cacheName: "cross-origin",
				networkTimeoutSeconds: 10,
				plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
			}),
			"GET",
		);
});

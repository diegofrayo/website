/** @type {import('next').NextConfig} */

const nextConfig = {
	experimental: {
		appDir: true,
	},

	// TODO: Set this config as true someday (keep informed about "prism-react-renderer" releases)
	swcMinify: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
		localeDetection: false,
	},
	redirects() {
		return [
			{
				source: "/blog/conectando-un-proyecto-de-firebase-con-un-dominio-de-go-daddy",
				destination: "/blog/connecting-a-firebase-project-with-a-go-daddy-domain",
				permanent: true,
				locale: false,
			},
			{
				source: "/es/blog/conectando-un-proyecto-de-firebase-con-un-dominio-de-go-daddy",
				destination: "/es/blog/connecting-a-firebase-project-with-a-go-daddy-domain",
				permanent: true,
				locale: false,
			},
			{
				source: "/es/blog/mi-musica-favorita-y-mdx",
				destination: "/blog/my-favorite-music-and-mdx",
				permanent: true,
				locale: false,
			},
			{
				source: "/blog/viajesito-por-colombia",
				destination: "/blog/a-trip-around-colombia",
				permanent: true,
				locale: false,
			},
			{
				source: "/blog/javascript-arrays-cheatsheet",
				destination: "/blog/javascript-arrays-examples",
				permanent: true,
				locale: false,
			},
		];
	},
	images: {
		disableStaticImages: true,
		domains: [new URL(process.env.NEXT_PUBLIC_ASSETS_SERVER_URL).hostname],
	},
};

const withMDX = require("@next/mdx");
const withPWA = require("next-pwa")({
	dest: "public",
	scope: "/",
	disable: process.env.DISABLE_PWA === "true",
});

module.exports = withMDX()(withPWA(nextConfig));
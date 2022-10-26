/** @type {import('next').NextConfig} */

const withMDX = require("@next/mdx");
const withPWA = require("next-pwa")({
	dest: "public",
	scope: "/",
	disable: process.env.DISABLE_PWA === "true",
});

module.exports = withMDX()(
	withPWA({
		// TODO: Replace babel with swc someday
		// swcMinify: true,
		// experimental: {
		// 	swcPlugins: [["@swc/plugin-styled-jsx", {}]],
		// },
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
			];
		},
	}),
);

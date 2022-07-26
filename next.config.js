const withMDX = require("@next/mdx");
const withPWA = require("next-pwa");

// TODO: Remove this
console.log(
	"PROCESS.ENV.DISABLE_PWA ===>",
	process.env.DISABLE_PWA,
	typeof process.env.DISABLE_PWA,
);

module.exports = withMDX()(
	withPWA({
		pwa: {
			dest: "public",
			scope: "/",
			disable: process.env.DISABLE_PWA === "true",
		},
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
			];
		},
	}),
);

const withPWA = require("next-pwa")({
	dest: "public",
	scope: "/",
	disable: process.env.DISABLE_PWA === "true",
});
const imagesRemoteDomain = new URL(process.env.NEXT_PUBLIC_WEBSITE_URL);

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		disableStaticImages: true,
		remotePatterns: [
			{
				protocol: imagesRemoteDomain.protocol.slice(0, -1),
				hostname: imagesRemoteDomain.hostname,
				port: imagesRemoteDomain.port || "",
			},
		],
	},
});

module.exports = nextConfig;

const withPWA = require("next-pwa")({
	dest: "public",
	scope: "/",
	disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		disableStaticImages: true,
		domains: [new URL(process.env.NEXT_PUBLIC_WEBSITE_URL).hostname],
	},
});

module.exports = nextConfig;

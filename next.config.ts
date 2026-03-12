import type { NextConfig } from "next";

const websiteURL = process.env["NEXT_PUBLIC_WEBSITE_URL"] || "";
const imagesRemoteDomain = new URL(websiteURL);

const nextConfig: NextConfig = {
	images: {
		disableStaticImages: true,
		remotePatterns: [imagesRemoteDomain],
	},
};

export default nextConfig;

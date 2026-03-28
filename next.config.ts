import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		disableStaticImages: true,
		remotePatterns: [new URL("https://dfrz-public.t3.storage.dev/**")],
	},
};

export default nextConfig;

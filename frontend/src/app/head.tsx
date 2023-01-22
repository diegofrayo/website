import { isDevelopmentEnvironment } from "~/utils/app";

export default function Head() {
	return (
		<>
			<title>Diego Rayo | Software Developer</title>
			<meta
				content="width=device-width, initial-scale=1"
				name="viewport"
			/>
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/static/images/favicon/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/static/images/favicon/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/static/images/favicon/favicon-16x16.png"
			/>
			<link
				rel="icon"
				href={`/static/images/favicon/favicon${isDevelopmentEnvironment() ? "-dev" : ""}.ico?v=3`}
			/>
		</>
	);
}

import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
	return (
		<Html>
			<Head>
				<Script
					src="https://app.rybbit.io/api/script.js"
					data-site-id="7533"
					strategy="beforeInteractive"
					defer={false}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

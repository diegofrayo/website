import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";

import type { T_ReactElement } from "~/types";

function Document(): T_ReactElement {
	return (
		<Html>
			<Head>
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
					crossOrigin="anonymous"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;700&display=swap"
					rel="stylesheet"
					crossOrigin="anonymous"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

export default Document;

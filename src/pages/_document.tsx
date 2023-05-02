import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";

import type { T_ReactElement } from "~/types";

function Document(): T_ReactElement {
	return (
		<Html>
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Comme:wght@200;400;700&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=PT+Mono:wght@200;400;700&display=swap"
					rel="stylesheet"
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

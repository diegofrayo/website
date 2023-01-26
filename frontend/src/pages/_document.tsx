import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";

import type { T_ReactElement } from "~/@legacy/src/types";

function Document(): T_ReactElement {
	return (
		<Html>
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Mulish:wght@200;400;700&display=swap"
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

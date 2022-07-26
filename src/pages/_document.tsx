import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";

import { isDevelopmentEnvironment } from "~/utils/app";
import type { T_ReactElement } from "~/types";

function Document(): T_ReactElement {
	return (
		<Html>
			<Head>
				<link
					href={`https://fonts.googleapis.com/css2?family=Mulish:wght@200;400;700&display=${
						isDevelopmentEnvironment() ? "swap" : "optional"
					}`}
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

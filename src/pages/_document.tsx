import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";

import { isDevelopmentEnvironment } from "~/utils/app";

export default function Document() {
	return (
		<Html>
			<Head>
				{isDevelopmentEnvironment() ? (
					<React.Fragment>
						<link
							rel="preconnect"
							href="https://fonts.googleapis.com"
						/>
						<link
							rel="preconnect"
							href="https://fonts.gstatic.com"
							crossOrigin=""
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Staatliches&display=swap"
							rel="stylesheet"
						/>
					</React.Fragment>
				) : null}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
